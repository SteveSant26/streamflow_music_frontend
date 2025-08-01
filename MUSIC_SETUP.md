# Music Player Setup

## Adding Music Files

To use the music player, add your audio files to the `public/assets/music/` folder with the following naming convention:

### File Structure
```
public/assets/music/
├── song1.mp3
├── song2.mp3
├── song3.mp3
└── ...
```

### Audio File Requirements
- **Format**: MP3 (recommended), also supports WAV, OGG
- **Location**: Files must be placed in `public/assets/music/`
- **Naming**: Use the song ID as the filename (e.g., `test-song.mp3`)

### Example Songs Configuration
The player will look for songs based on their ID. For example:
- Song ID: `"test-song"` → File: `public/assets/music/test-song.mp3`
- Song ID: `"my-favorite"` → File: `public/assets/music/my-favorite.mp3`

### Adding Your Music
1. Create the `music` folder inside `public/assets/`
2. Copy your MP3 files into `public/assets/music/`
3. Update the song configuration in the player component to match your files

### Current Test Song
The player is currently configured to load a test song with ID `"test-song"`. 
Add a file named `test-song.mp3` to `public/assets/music/` to test the player immediately.
