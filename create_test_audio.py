# Audio Files Generator Script

# This script creates valid MP3 files with silence for testing
# Since we can't include real music files due to copyright, 
# we'll create valid silent MP3 files that the audio player can load

import base64
import os

# Minimal valid MP3 file data (1 second of silence)
MP3_SILENT_DATA = base64.b64decode("""
SUQzAwAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD//////////////////////////////////////////////////////////////////8AAAAAGhQsAAGTJllZZWXlXUZA1cFZQo2NhKOjQElFSkpKQElElFElFEl91EpWWVdxFlc5QElFUklBQEVGU0pKQUVVSkpKSEVKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpK
""")

# Create the music directory if it doesn't exist
music_dir = "frontend/public/assets/music"
os.makedirs(music_dir, exist_ok=True)

# Create test MP3 files
test_files = [
    "song1.mp3",
    "song2.mp3", 
    "test-song.mp3",
    "my-favorite-track.mp3"
]

for filename in test_files:
    filepath = os.path.join(music_dir, filename)
    with open(filepath, "wb") as f:
        f.write(MP3_SILENT_DATA)
    print(f"Created: {filepath}")

print("Test MP3 files created successfully!")
