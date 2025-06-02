## Cinemata: An Enhanced MediaCMS-based Video Platform for Asia-Pacific Social Issue Films

[Cinemata](https://cinemata.org) is an open-source project that builds upon MediaCMS, enhancing it with features specifically designed for showcasing social issue films from the Asia-Pacific region. Since its public release in 2021, Cinemata has developed numerous features that were previously exclusive to its platform and not available in the core MediaCMS. The project is managed by EngageMedia, an Asia-Pacific non-profit advocating for digital rights, open-technology and social issue films.

Our goal is to make these Cinemata-specific integrations and improvements to MediaCMS available to the public, enabling more organizations to maximize the potential of this powerful video content management system.

### Key features:
- [Core MediaCMS features](https://github.com/mediacms-io/mediacms)
- Cinemata-specific enhancements:
  - Custom CSS and UI components for a unique, tailored look distinct from baseline MediaCMS
  - Featured video and playlists on the front page
  - Customized playlists and embedding options on the front page
  - Integration of Open AI Foundation's Whisper ASR model for English translation
  - Ability to upload, edit, and download .SRT files for subtitles or captions

### Screenshots

<p align="center">
    <img src="https://github.com/EngageMedia-video/cinemata/blob/main/images/Github-Cinemata-Screenshot1.png" width="340">
    <img src="https://github.com/EngageMedia-video/cinemata/blob/main/images/Github-Cinemata-Screenshot2.png" width="340">
    <img src="https://github.com/EngageMedia-video/cinemata/blob/main/images/Integration%20of%20Whisper%20ASR%20for%20English%20Translation.png" width="340">
</p>

### History

Cinemata's content originates from EngageMedia's previous video platform, which operated from 2006 to 2020 using the Plumi video content management system. By migrating this valuable archive to an improved MediaCMS-based platform, we're ensuring the preservation and continued accessibility of essential narratives from the region. Since its launch, the current Cinemata site has added more than 2,000 videos contributed by its active users, further enriching its collection of social issue films. Cinemata is co-developed by Markos Gogoulos of MediaCMS.

“Cinemata” comes from the combination of “cine”, which means “motion picture”, and “mata”, which means “eye” in several regional languages:

- In Bahasa Malaysia, Bahasa Indonesia, and Filipino, the word for “eye” is “mata”
- In Tetum (East Timor), the word for “eye” is “matan”
- In Vietnamese, the word for “eye” is “mắt”
- In Thai and Lao, the word for “eye” is “ta”

“Cinemata” represents our focus on highlighting Asia-Pacific perspectives and connecting issues, films, and filmmakers in the region.

### Cinemata 2.0

With Cinemata 2.0, we're building a community of developers, designers, and contributors who share our vision of bringing critical but often overlooked stories to the forefront. Join us in creating an enhanced version of MediaCMS that connects filmmakers, advocacy groups, human rights defenders, educators, and audiences through collaborative initiatives such as film screenings, archiving, curation, outreach, and promotion.

Help us empower voices across the Asia-Pacific and foster meaningful discussions on pressing social issues. By contributing to this project, you'll be part of an effort to make these powerful tools available to a wider range of organizations, amplifying the impact of visual storytelling for social change.​​​​​​​​​​

# Cinemata 2.0 Roadmap

## Milestone 1: 3 to 6 months

#### 1. Security and Privacy Improvements
- Implementation of security audit recommendations
- Enhanced data encryption for user metadata
- Improved authentication and authorization systems
- Enhanced privacy controls for content access

#### 2. Performance Optimization
- Implement caching and Content Delivery Network (CDN) solutions to improve website loading speed
- Server location optimization assessment

#### 3. File Upload System
- Implementation of reliable chunked upload system
- Cloudflare Pro integration and configuration
- Upload size management based on user roles
- Enhanced upload progress monitoring and error handling

#### 4. Expanded Django Admin Functionality
- Configure maximum upload sizes for each user role: Contributor, Trusted user, Editor and Manager
- Ability to reset transcoding and Whisper translations via Django admin

#### 5. Notification System
- Comments on user's content
- Likes on user's content
- User's promotion to a Trusted User and other user roles

#### 6. Rich Text Input Enhancements
- Upgrade the existing rich text formatting functionality in Media and Static pages input fields to improve user experience, increase reliability, and expand formatting options
- Add form creation support in sidebar pages to host Trusted User applications

## Milestone 2: 6 months to one year

#### 1. Community Engagement Features
- Enhance the comments and likes interface and related moderation tools
- Build the ability to follow other users
- Develop a notification system for new content and interactions

#### 2. Co-viewing Experience
- Enhance the UI of the Media Page to better view comments

#### 3. Localisation
- Translate the user interface into multiple languages, focusing on Asia-Pacific languages
- Implement region-specific content recommendations

#### 4. Content Curation and Discovery
- Easily view curated playlists and collections based on themes or genres
- Improve and implement the site's tagging system for more granular content categorization

#### 5. Video Upload Process Enhancements
- Redesign the upload flow to allow metadata input before video upload
- Add the ability for users to easily remove or replace uploaded videos
- Implement a progress bar and estimated time for video processing

#### 6. Monetization Options
- Build a donation system for viewers to support content creators via mobile wallets

#### 7. Members-only Features
- Unique featured video and playlists on the front page as a precursor for 'Cinemata Premium/Prism'

#### 8. Cloud Infrastructure Exploration
- Move media processing (video transcoding, thumbnail generation, Whisper translations) to cloud-native platform while maintaining current core infrastructure
- Set up content delivery optimization through cloud services
- Implement monitoring system for cloud resource usage

## Milestone 3: 2 to 3 years

#### 1. Enhanced Site Design Layout
- New color scheme and typography
- Improve the appearance of the playlist page

#### 2. Live Streaming Integration
- Develop infrastructure to support live streaming
- Implement features for scheduled streams and notifications

#### 3. Creator Dashboard
- Develop a basic analytics dashboard for content creators
- Include metrics like views, engagement rates, and viewer demographics

#### 4. Advanced Creator Tools
- Add the ability to schedule content releases and set availability periods

#### 5. Mobile Platform Development
- Develop and launch a mobile-optimized version of Cinemata
- Enhance platform accessibility and user experience across devices

#### 6. Community Screening Features
- Implement tools for online community screening and small film festival events



## Installation
The instructions have been tested on Ubuntu 22.04. Make sure there is no other services running in the system, specifically no nginx/postgresql, as the installation script will install them and replace any configs.

As root, clone the repository on /home/mediacms.io and run install.sh:

```
# cd /home
# mkdir mediacms.io && cd mediacms.io
# git clone https://github.com/EngageMedia-video/cinemata mediacms && cd mediacms
# chmod +x install.sh
# ./install.sh
```

This should take a few minutes with dependencies etc. Make sure you enter a valid domain when asked (eg staging.cinemata.org)

