<!-- Previous content remains the same until the Installation section -->

### 1. Install System Dependencies

```bash
# Install base dependencies
sudo pacman -S nodejs npm git base-devel python python-pip

# Install Python TTS library
pip install pyttsx3

# Install system audio dependencies
sudo pacman -S alsa-utils pulseaudio-alsa
```

<!-- Rest of the README remains the same -->