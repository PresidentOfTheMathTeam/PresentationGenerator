# Instructions

This guide will walk you through how to set up and use the caption generator for UMC services.

If this is the first time using the generator on your computer, make sure you also follow the [OBS One-Time Setup Guide.](#obs-one-time-setup)

## Getting Started

1) Open up [the generator](https://presidentofthemathteam.github.io/PresentationGenerator/) in a new tab.

**I recommend you bookmark the generator and this site (with the instructions) so you can easily get back to it.**

2) You should now be on a page that looks like this:

<img width="622" height="332" alt="image" src="https://github.com/user-attachments/assets/5bcd8299-75c6-4fde-af4c-ce87aa3e84c6" />

3) To start, either load the Default Service, to get a starting place, or add your own caption.
For your first time, I suggest you load the default service, maybe fill in a bit of the caption text, and try exporting to PowerPoint and OBS to see what the program can do. (Skim through the rest of this til you find the [export options](#how-to-export) if you choose to do so)
After that, I emplore you to reload the page and learn how each individual caption type works with a blank presentation.

**Captions added from the button will always appear at the bottom of the service.**

<img width="622" height="332" alt="image" src="https://github.com/user-attachments/assets/9f998df3-2170-46df-9a1b-c92908791684" />

You should now have a caption, which will (typically) be saved into both OBS and Powerpoint, when you decide to export it.



## Manipulating the caption

<img width="418" height="146" alt="image" src="https://github.com/user-attachments/assets/3c95eec3-9762-49e5-a534-30a0b1d8f04d" />

Each caption has buttons to change the caption type (ie. from a Hymn to the Lord's Prayer), move it up or down within the service, or delete it entirley.


## Details on all of the caption types:

### Large Text

The centered (large text) caption has two fields. The first field will show up both on OBS as well as in the Powerpoint for the in-person service. The second field, however, will only show up on the Powerpoint.
This is useful incase you would like to add extra details (for example *Stand as you are able*) that would be more relevant to in-person guests compared to those online.

Settings in the program:

<img width="600" alt="image" src="https://github.com/user-attachments/assets/798f72fb-3ded-4cfb-bcfe-59eaa5c43144" />

Preview in OBS:

<img width="600" alt="image" src="https://github.com/user-attachments/assets/a3d8b6ce-e328-48f9-9e91-c2ff21859b8b" />

### Full Body Text

The full body text **ONLY** shows up in the Powerpoint file, and is completely ignored by OBS. This is helpful when you would like to add a call & response section, like the Call to Worship.
To edit the text click the edit text. [Click here to learn the syntax for creating slides and congregational repsonses](#lyricsbody-text-syntax-guide)

This is used for the text of the Prayer of the Day, for example. However, due to the fact that does not generate any caption in OBS, it is reccomended that you use a large caption right above it. This not only provides a caption for OBS, but additionally creates a section header in Powerpoint before the content of the prayer/etc.

<img width="800" alt="image" src="https://github.com/user-attachments/assets/ca36b805-d4f7-439b-a37c-ee3d636a05a2" />


This is how I would add the text of the Prayer of the Day to the service. The first, "Large Text" caption shows up as a header slide in both OBS & Powerpoint to introduce the section.
The second part, or the Full Body Text, will include the actual prayer of the day text, just for Powerpoint, and gets completely ignored by the OBS export.

### Bible Verse

The Bible Verse includes an input for a section title (ex. The Gospel, shown on the left on OBS) as well as an input for the verse being read, which is the italicized text in OBS.

If you click "edit verse," you will see options to input a bible verse into the PowerPoint version of the service. [More information on how to import bible verses automatically here!](#for-hymnsbible-verses)
These lines of the verses will not show up in OBS, only on the PowerPoint slide. Note you can always leave the field blank if you wish to only show the section header.

<img width="600" alt="image" src="https://github.com/user-attachments/assets/1caa9c88-fbf2-4c49-a4d0-b582c7f38d71" />

### Hymn

The first text input is for the section of the service. It is shown in OBS as left-aligned text. For example, in the example below, I would input `Hymn of Praise`.
Don't imput the hymn number or any other related information in this field, simply the `Hymn of Praise`, or `Closing Hymn`, **NOT** `Hymn of Praise #239`

The second text input is for both the number and the book. In the example below, I would input `239 - UMH` or `239 - HYMNAL`, depending on your personal prefrence.
**DO NOT** input a # sign into this field. The program will automatically add it in its proper place for both the PowerPoint and OBS.

The reason those two inputs are seprate is because the Program puts them in different spots in OBS and PowerPoint!

Finally, the last input is the right-aligned text in OBS, and is the name of the hymn.

Similarly to the Bible Verses, you can automatically import the lyrics from the Hymn Library. [More information on how to import lyrics automatically here!](#for-hymnsbible-verses)
If there are no lyrics/you do not wish to show them for the hymn you are doing, simply leave the field blank.

<img width="600" alt="image" src="https://github.com/user-attachments/assets/7f475c16-6e41-460b-bfd5-59a8c406a436" />

### Other Music

Special Music fields are for music, like the pre/postlude that aren't in the Hymnal.

The left aligned text is shown on the left in OBS, and should be inputted as `Postlude` or `Offertory` (as shown in the example).

The song name is shown on the right in OBS, and all of the other details are shown only on the PowerPoint.

If there are no lyrics/you do not wish to show them for the song you are doing, simply leave the field blank. Otherwise, you can edit the lyrics similar to the Hymn or Bible Verse editor, however, there are no preset options.

<img width="600" alt="image" src="https://github.com/user-attachments/assets/427b5759-7ed9-4850-aa80-8a4fa73d82b5" />

### Title

You should start every service with a title slide. For the title slide, select the date for the service you are doing as well as subtext for the service (Ex. `3rd Sunday in Lent`). This is hidden in OBS and only shown on PowerPoint. You should typically begin ever service you create with a title slide.

### Lord's Prayer & Communion Captions

The Lord's Prayer & Communion captions include both captions in OBS and Powerpoint. They both include presets for Powerpoint of all of the text for the specific events. 

**IMPORTANT NOTE:** The communion caption automatically includes the Lord's Prayer in the proper place. Don't include the Lord's Prayer if you have a communion caption added.

## How to export

### Exporting to PowerPoint

Exporting to PowerPoint is very simple! Simply click the export button and then open the downloaded PowerPoint file.

<img width="475" height="224" alt="image" src="https://github.com/user-attachments/assets/0950a563-c2ef-4d2e-879a-48718c5a536f" />

### Exporting to OBS

**IF THIS IS YOUR FIRST TIME EXPORTING CAPTIONS INTO OBS, MAKE SURE TO FOLLOW THE [OBS ONE-TIME SETUP GUIDE!!!](#obs-one-time-setup)**

If you already have used the generator on your device, continue onto the next steps:

1) Export the captions to OBS on the bottom of the page. This will download a JSON file to your computer.

<img width="475" height="224" alt="image" src="https://github.com/user-attachments/assets/0950a563-c2ef-4d2e-879a-48718c5a536f" />

2) Open OBS

3) Go to Tools > Scripts
<img width="285" height="250" alt="image" src="https://github.com/user-attachments/assets/d82fe187-6043-40db-80fb-80c32dbe562e" />

4) Click on the "caption-importer.lua" script and click "Browse" to select the JSON file downloaded by the generator.
<img height="400" alt="image" src="https://github.com/user-attachments/assets/fbf09765-c804-4e4e-864b-44e534d6444c" />

5) Click "Import Captions", then "Close"

6) A new scene will be generated in OBS called "Imported Captions"
<img width="252" height="225" alt="image" src="https://github.com/user-attachments/assets/c08ed77d-7ef1-42ef-bea5-144a42262af6" />

7) Add a new "Video Capture Device" to the scene
<img width="300" height="227" alt="image" src="https://github.com/user-attachments/assets/3528e29a-02d9-4558-bd94-a5b545a990f6" />

When importing, it will create a brand new scene with all the captions. Therefore, you will need to re-add the camera to the new scene.

8) Change the device to something along the line of "USB Camera" or "PTZ Camera", whatever makes the sanctuary appear!
<img width="677" height="227" alt="image" src="https://github.com/user-attachments/assets/9c772699-4c30-4268-ac43-59ffb3a672a0" />

Your captions should now appear in OBS!

# Additional Notes

## Lyrics/Body Text Syntax Guide

It is easy to generate multiple slides at once through the lyrics/body text editor. This appears when you add a hymn, general music, bible verse, or body text section to your project.

For example, if I wanted to include the call and response:

This is the pastor speaking

**We are the congregation**

This is on a 2nd slide

**We are the congregation**

I would input it like this:

```
This is the pastor speaking
We are the congregation
```

However, I want to signifiy that the congregation repeats that line. To do that, I would use the characters `**` to surround the text. Here is my result:

```
This is the pastor speaking
**We are the congregation**
```

Next, to add the 2nd slide of content, I would seperate the two slides using the text: `[NEWSLIDE]` to put all content after that point on its own, unique slide.

**FINAL, CORRECT FORMATTING:**

```
This is the pastor speaking
**We are the congregation**
[NEWSLIDE]
This is on a 2nd slide
**We are the congregation**
```

**A few notes:**

Using `**` does not work between slides. For example,

```
**This is a response
[NEWSLIDE]
This is also a response**
```

would not be correct. The `**` seperator must both start and be terminated within the same slide. This is how it would be properly done:

```
**This is a response**
[NEWSLIDE]
**This is also a response**
```

Note that `**` is ended inside of each individual slide.

Additionaly, **remember that [NEWSLIDE] should only be used on its own, unique line.**

This is incorrect:

```
This is my 1st slide [NEWSLIDE]
This is my 2nd slide
```

and should be replaced by:

```
This is my 1st slide
[NEWSLIDE]
This is my 2nd slide
```

It is also possible to resize the input space for this! To change the size of the input field, click and drag the icon on the bottom left corner.

<img width="500" alt="image" src="https://github.com/user-attachments/assets/f824b446-da21-47d7-b59f-77c99a1b77f1" />


### For Hymns/Bible Verses
<img width="480" height="54" alt="image" src="https://github.com/user-attachments/assets/0668f4b5-cce9-4944-8402-a21b1b0f0e32" />
<img width="478" height="51" alt="image" src="https://github.com/user-attachments/assets/d68e08d0-6b8c-4d07-9a06-3c0592073697" />

To make adding lyrics easier for these service items, I included a way to automatically load the lyrics for specific hymns/verses.

For example, if I wanted to add the lyrics for Silent Night (#239 in the Hymnal), I would input the number 239 and select the book "Hymnal". Then, I would click the button "Load Lyrics".
The Lyrics should then appear in the textbox below:

<img width="542" height="420" alt="image" src="https://github.com/user-attachments/assets/82c9d0fc-9888-4dad-a149-4b492e3fb007" />

**SOME HYMNS WILL NOT SHOW UP IN THE LIBRARY, AND SOME WILL NOT HAVE THE LYRICS IMPORTED.**

If you encounter a hymn without lyrics, I suggest you look up the lyrics on Google, add the `[NEWSLIDE]` seperators to make sure they are formatted correctly,
AND THEN email me ([jademathi@outlook.com](mailto:jademathi@outlook.com)) the lyrics you found along with the hymn name and number so I can add it to the library for the future.

Likewise, if I wanted to load the bible verses John 3:10 through 3:14, I would input the book name (in all lowercase) like so:

` john `

Then, add a space and add the chapter number:

` john 3 `

Finally, add a colon then the range of verses to import:

` john 3:10-14 `

<img width="546" height="422" alt="image" src="https://github.com/user-attachments/assets/03ae9e7f-e956-40fd-86f1-687fd06b195a" />

Most verses will automatically be spaced out properly between individual slides. However, having a bunch of verses 

**WARNING! FAILURE TO FOLLOW THIS FORMAT WILL CAUSE THE IMPORT TO FAIL!**


## OBS One-Time Setup

**This only needs to be done the first time you try to use the OBS captions on a computer!**

1) Download the [one time OBS install script](caption-importer.lua) and place it some where important, like your desktop.
<img height="400" alt="image" src="https://github.com/user-attachments/assets/744567e5-867f-4c08-a56a-c5152ffd7fc6" />

2) In OBS, go to Tools -> Scripts
<img width="285" height="250" alt="image" src="https://github.com/user-attachments/assets/d82fe187-6043-40db-80fb-80c32dbe562e" />

3) Click the "+" button and import the script
<img height="250" alt="image" src="https://github.com/user-attachments/assets/23da3522-38c0-48f0-80d4-6eb74a045d30" />

4) Your OBS is now setup and should look something like this:
<img height="400" alt="image" src="https://github.com/user-attachments/assets/fbf09765-c804-4e4e-864b-44e534d6444c" />
