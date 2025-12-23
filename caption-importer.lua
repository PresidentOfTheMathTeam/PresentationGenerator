obs = obslua

-- Script settings
local json_path = ""

-- JSON parsing function (simple implementation)
local function parse_json(str)
    -- Remove whitespace
    str = str:gsub("^%s+", ""):gsub("%s+$", "")
    
    local pos = 1
    local function skip_whitespace()
        while pos <= #str and str:sub(pos, pos):match("%s") do
            pos = pos + 1
        end
    end
    
    local function parse_value()
        skip_whitespace()
        local char = str:sub(pos, pos)
        
        if char == '"' then
            -- String
            pos = pos + 1
            local start = pos
            while pos <= #str do
                local c = str:sub(pos, pos)
                if c == '"' then
                    local result = str:sub(start, pos - 1)
                    pos = pos + 1
                    -- Handle escape sequences
                    result = result:gsub("\\n", "\n")
                    result = result:gsub("\\t", "\t")
                    result = result:gsub("\\\"", "\"")
                    result = result:gsub("\\\\", "\\")
                    return result
                elseif c == "\\" then
                    pos = pos + 2
                else
                    pos = pos + 1
                end
            end
        elseif char == "{" then
            -- Object
            pos = pos + 1
            local obj = {}
            skip_whitespace()
            if str:sub(pos, pos) == "}" then
                pos = pos + 1
                return obj
            end
            while true do
                skip_whitespace()
                local key = parse_value()
                skip_whitespace()
                pos = pos + 1 -- skip colon
                local value = parse_value()
                obj[key] = value
                skip_whitespace()
                local next_char = str:sub(pos, pos)
                pos = pos + 1
                if next_char == "}" then
                    return obj
                end
            end
        elseif char == "[" then
            -- Array
            pos = pos + 1
            local arr = {}
            skip_whitespace()
            if str:sub(pos, pos) == "]" then
                pos = pos + 1
                return arr
            end
            while true do
                local value = parse_value()
                table.insert(arr, value)
                skip_whitespace()
                local next_char = str:sub(pos, pos)
                pos = pos + 1
                if next_char == "]" then
                    return arr
                end
            end
        elseif str:sub(pos, pos + 3) == "true" then
            pos = pos + 4
            return true
        elseif str:sub(pos, pos + 4) == "false" then
            pos = pos + 5
            return false
        elseif str:sub(pos, pos + 3) == "null" then
            pos = pos + 4
            return nil
        else
            -- Number
            local start = pos
            while pos <= #str and str:sub(pos, pos):match("[%d%.%-eE%+]") do
                pos = pos + 1
            end
            return tonumber(str:sub(start, pos - 1))
        end
    end
    
    return parse_value()
end

-- Read file contents
local function read_file(path)
    local file = io.open(path, "r")
    if not file then
        return nil
    end
    local content = file:read("*all")
    file:close()
    return content
end

-- Create a color source
local function create_color_source(name, width, height, color)
    local settings = obs.obs_data_create()
    obs.obs_data_set_int(settings, "width", width)
    obs.obs_data_set_int(settings, "height", height)
    obs.obs_data_set_int(settings, "color", color)
    
    local source = obs.obs_source_create("color_source_v3", name, settings, nil)
    obs.obs_data_release(settings)
    return source
end

-- Create a text source with extents for proper alignment
local function create_text_source_simple(name, text, font_name, font_size, font_flags, extents_cx, extents_cy, align, valign)
    local settings = obs.obs_data_create()
    obs.obs_data_set_string(settings, "text", text)
    
    -- Font settings
    local font = obs.obs_data_create()
    obs.obs_data_set_string(font, "face", font_name)
    obs.obs_data_set_int(font, "size", font_size)
    obs.obs_data_set_int(font, "flags", font_flags)
    obs.obs_data_set_obj(settings, "font", font)
    obs.obs_data_release(font)
    
    -- Text color - black
    obs.obs_data_set_int(settings, "color", 0xFF000000)
    
    -- Use extents for reliable alignment
    obs.obs_data_set_bool(settings, "extents", true)
    obs.obs_data_set_int(settings, "extents_cx", extents_cx)
    obs.obs_data_set_int(settings, "extents_cy", extents_cy)
    obs.obs_data_set_bool(settings, "extents_wrap", true)  -- Required for alignment to work
    
    -- Alignment: "left", "center", "right"
    obs.obs_data_set_string(settings, "align", align)
    -- Vertical alignment: "top", "center", "bottom"
    obs.obs_data_set_string(settings, "valign", valign)
    
    local source = obs.obs_source_create("text_gdiplus", name, settings, nil)
    obs.obs_data_release(settings)
    return source
end

-- Main import function
local function import_captions(props, prop)
    if json_path == "" then
        obs.script_log(obs.LOG_WARNING, "No JSON file selected")
        return false
    end
    
    -- Read and parse JSON
    local content = read_file(json_path)
    if not content then
        obs.script_log(obs.LOG_ERROR, "Failed to read JSON file: " .. json_path)
        return false
    end
    
    local data = parse_json(content)
    if not data or not data.captions then
        obs.script_log(obs.LOG_ERROR, "Invalid JSON format")
        return false
    end
    
    obs.script_log(obs.LOG_INFO, "Found " .. #data.captions .. " captions")
    
    -- Create new scene
    local scene_source = obs.obs_source_create("scene", "Imported Captions", nil, nil)
    local scene = obs.obs_scene_from_source(scene_source)
    
    -- Screen dimensions and positioning
    local screen_width = 1920
    local screen_height = 1080
    local bar_height = 200
    local bar_y = screen_height - bar_height  -- 880 (bottom of screen)
    
    -- Hard-coded X positions for song type
    local left_margin = 50
    local right_margin = 50
    
    -- Process captions in REVERSE order so first item ends up at top of OBS list
    for i = #data.captions, 1, -1 do
        local caption = data.captions[i]
        local caption_type = caption.type
        local texts = caption.text
        local group_name = texts[1] .. " " .. i
        
        obs.script_log(obs.LOG_INFO, "Creating group: " .. group_name)
        
        -- Create group (don't position yet)
        local group = obs.obs_scene_add_group(scene, group_name)
        
        if caption_type == "centered" then
            -- Create centered text FIRST (so it appears above background)
            local text_name = "Centered Text " .. i
            local text_source = create_text_source_simple(
                text_name,
                texts[1],
                "Arial",
                70,
                0,  -- Regular
                screen_width,  -- extents width
                bar_height,    -- extents height
                "center",      -- horizontal align
                "center"       -- vertical align
            )
            local text_item = obs.obs_scene_add(scene, text_source)
            obs.obs_sceneitem_group_add_item(group, text_item)
            
            -- Position text at group origin (alignment handled by extents)
            local text_pos = obs.vec2()
            text_pos.x = 0
            text_pos.y = 0
            obs.obs_sceneitem_set_pos(text_item, text_pos)
            
            -- Create background color source SECOND (so it appears below text)
            local bg_name = "Background " .. i
            local bg_source = create_color_source(bg_name, screen_width, bar_height, 0xFFFFFFFF)
            local bg_item = obs.obs_scene_add(scene, bg_source)
            obs.obs_sceneitem_group_add_item(group, bg_item)
            
            -- Position background at origin of group
            local bg_pos = obs.vec2()
            bg_pos.x = 0
            bg_pos.y = 0
            obs.obs_sceneitem_set_pos(bg_item, bg_pos)
            
            -- Release sources
            obs.obs_source_release(text_source)
            obs.obs_source_release(bg_source)
            
        elseif caption_type == "song" then
            -- Create section text FIRST (left side)
            local section_name = "Section Text " .. i
            local section_source = create_text_source_simple(
                section_name,
                texts[1],
                "Arial",
                70,
                0,  -- Regular
                screen_width - left_margin - right_margin,  -- extents width
                bar_height,    -- extents height
                "left",        -- horizontal align
                "center"       -- vertical align
            )
            local section_item = obs.obs_scene_add(scene, section_source)
            obs.obs_sceneitem_group_add_item(group, section_item)
            
            local section_pos = obs.vec2()
            section_pos.x = left_margin
            section_pos.y = 0
            obs.obs_sceneitem_set_pos(section_item, section_pos)
            
            -- Create song text SECOND (right side, italic)
            local song_name = "Song Text " .. i
            local song_text = texts[2] or ""
            local song_source = create_text_source_simple(
                song_name,
                song_text,
                "Arial",
                70,
                2,  -- Italic
                screen_width - left_margin - right_margin,  -- extents width
                bar_height,    -- extents height
                "right",       -- horizontal align
                "center"       -- vertical align
            )
            local song_item = obs.obs_scene_add(scene, song_source)
            obs.obs_sceneitem_group_add_item(group, song_item)
            
            local song_pos = obs.vec2()
            song_pos.x = left_margin
            song_pos.y = 0
            obs.obs_sceneitem_set_pos(song_item, song_pos)
            
            -- Create background color source LAST (so it appears below text)
            local bg_name = "Background " .. i
            local bg_source = create_color_source(bg_name, screen_width, bar_height, 0xFFFFFFFF)
            local bg_item = obs.obs_scene_add(scene, bg_source)
            obs.obs_sceneitem_group_add_item(group, bg_item)
            
            -- Position background at origin of group
            local bg_pos = obs.vec2()
            bg_pos.x = 0
            bg_pos.y = 0
            obs.obs_sceneitem_set_pos(bg_item, bg_pos)
            
            -- Release sources
            obs.obs_source_release(section_source)
            obs.obs_source_release(song_source)
            obs.obs_source_release(bg_source)
        end
        
        -- Position the group at bottom of screen AFTER adding all items
        local group_pos = obs.vec2()
        group_pos.x = 0
        group_pos.y = bar_y
        obs.obs_sceneitem_set_pos(group, group_pos)
        
        -- Hide and lock the group (but not items inside)
        obs.obs_sceneitem_set_visible(group, false)
        obs.obs_sceneitem_set_locked(group, true)
        
        -- Collapse the group so items are hidden in the list
    end
    
    -- Release scene source
    obs.obs_source_release(scene_source)
    
    obs.script_log(obs.LOG_INFO, "Import complete! Created scene 'Imported Captions'")
    return true
end

-- Script description
function script_description()
    return [[
Caption Importer Script

Instructions:
1. Select the file downloaded from the generator using the file picker
2. Click "Import Captions"
3. A new scene called "Imported Captions" will be created
4. Add the camera to the new scene and it should now work!
]]
end

-- Script properties
function script_properties()
    local props = obs.obs_properties_create()
    
    obs.obs_properties_add_path(
        props,
        "json_file",
        "JSON File",
        obs.OBS_PATH_FILE,
        "JSON Files (*.json)",
        nil
    )
    
    obs.obs_properties_add_button(
        props,
        "import_button",
        "Import Captions",
        import_captions
    )
    
    return props
end

-- Script update (when settings change)
function script_update(settings)
    json_path = obs.obs_data_get_string(settings, "json_file")
end

-- Script defaults
function script_defaults(settings)
    obs.obs_data_set_default_string(settings, "json_file", "")
end
