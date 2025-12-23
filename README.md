# Instructions

This guide will walk you through how to set up and use the caption generator for UMC services.

If this is the first time using the generator on your computer, make sure you also follow the [OBS One-Time Setup Guide.](#obs-one-time-setup)

## Getting Started

1) Open up [the generator](https://presidentofthemathteam.github.io/PresentationGenerator/) in a new tab.

**I recommend you bookmark the generator and this site (with the instructions) so you can easily get back to it.**

2) You should now be on a page that looks like this:

<img width="622" height="332" alt="image" src="https://github.com/user-attachments/assets/5bcd8299-75c6-4fde-af4c-ce87aa3e84c6" />

3) To start, either load the Default Service, to get a starting place, or add your own caption.

**Captions added from the button will always appear at the bottom of the service.**

<img width="622" height="332" alt="image" src="https://github.com/user-attachments/assets/9f998df3-2170-46df-9a1b-c92908791684" />

You should now have a caption, which will (typically) be saved into both OBS and Powerpoint, when you decide to export it.



## Manipulating the caption

<img width="418" height="146" alt="image" src="https://github.com/user-attachments/assets/3c95eec3-9762-49e5-a534-30a0b1d8f04d" />

Each caption has buttons to change the caption type (ie. from a Hymn to the Lord's Prayer), move it up or down within the service, or delete it entirley.


## Details on all of the caption types:

### Centered Caption

The centered caption has two fields. The first field will show up both on OBS as well as in the Powerpoint for the in-person service. The second field, however, will only show up on the Powerpoint.
This is useful incase you would like to add extra details (for example *Stand as you are able*) that would be more relevant to in-person guests compared to those online.

Preview in OBS:

<img width="600" alt="image" src="https://github.com/user-attachments/assets/a3d8b6ce-e328-48f9-9e91-c2ff21859b8b" />

### Full Body Text

The full body text **ONLY** shows up in the Powerpoint file, and is completely skipped over by OBS. This is helpful when you would like to add a call & responce section, like the Call to Worship.
To edit the text click the edit text.


<img width="1158" height="200" alt="image" src="https://github.com/user-attachments/assets/7f475c16-6e41-460b-bfd5-59a8c406a436" />





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

### For Hymns/Bible Verses
<img width="480" height="54" alt="image" src="https://github.com/user-attachments/assets/0668f4b5-cce9-4944-8402-a21b1b0f0e32" />
<img width="478" height="51" alt="image" src="https://github.com/user-attachments/assets/d68e08d0-6b8c-4d07-9a06-3c0592073697" />

To make adding lyrics easier for these parts, I included a way to automatically load the lyrics for specific hymns/verses.

For example, if I wanted to add the lyrics for Silent Night (#239 in the Hymnal), I would input the number 239 and select the book "Hymnal". Then, I would click the button "Load Lyrics".
The Lyrics should then appear in the textbox below:

<img width="542" height="420" alt="image" src="https://github.com/user-attachments/assets/82c9d0fc-9888-4dad-a149-4b492e3fb007" />

Likewise, if I wanted to load the bible verses John 3:10 through 3:14, I would input the book name (in all lowercase) like so:

` john `

Then, add a space and add the chapter number:

` john 3 `

Finally, add a colon then the range of verses to import:

` john 3:10-14 `

<img width="546" height="422" alt="image" src="https://github.com/user-attachments/assets/03ae9e7f-e956-40fd-86f1-687fd06b195a" />

**WARNING! BREAKING AWAY FROM THIS FORMAT WILL CAUSE THE IMPORT TO FAIL!**


## OBS One-Time Setup

1) Download the [one time OBS install script](caption-importer.lua) and place it some where important, like your desktop.
<img width="1426" height="869" alt="image" src="https://github.com/user-attachments/assets/744567e5-867f-4c08-a56a-c5152ffd7fc6" />

2) In OBS
