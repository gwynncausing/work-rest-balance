# Work-Rest Balance

A browser extension that helps you maintain a healthy work-rest balance by scheduling regular breaks and reminding you to take care of yourself.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)

## Features

- **Scheduled Breaks**: Set custom intervals for automatic break reminders
- **Manual Break Mode**: Start a break whenever you need one
- **Full-Screen Break Overlay**: An immersive break screen that covers all your tabs
- **Customizable Settings**: Adjust break duration and frequency to match your workflow
- **Visual Timer**: See how much time is left in your break or until the next one
- **Easy Controls**: Start, stop, and manage breaks from the popup or options page

## Installation

### Install from Source

1. Download or clone this repository:
   ```bash
   git clone https://github.com/yourusername/workrest-balance.git
   ```

2. Open your browser and navigate to the extensions page:
   - **Chrome/Edge**: `chrome://extensions/`
   - **Brave**: `brave://extensions/`

3. Enable "Developer mode" (toggle in the top right)

4. Click "Load unpacked" and select the extension directory

5. The Work-Rest Balance icon should now appear in your browser toolbar!

## How to Use

### Quick Start

1. Click the extension icon in your browser toolbar
2. Click **"Start Schedule"** to begin automatic break reminders
3. Customize your break intervals in the settings page

### Popup Controls

- **Start Break Now**: Immediately start a break session
- **Stop Break**: End your current break early
- **Start/Stop Schedule**: Enable or disable automatic break scheduling
- **Settings**: Access the full settings page

### Settings Configuration

Access settings by:
- Clicking "Settings" in the popup
- Right-clicking the extension icon → "Options"

Available settings:
- **Break Interval**: Time between breaks (default: 30 minutes)
- **Break Duration**: Length of each break (default: 5 minutes)
- **Stop After Next Break**: Automatically disable schedule after one break

### Break Screen

When a break starts:
- A full-screen overlay appears across all tabs
- Timer shows remaining break time
- Motivational message encourages you to rest
- Click "End Break Early" to return to work if needed

## Technical Details

### Technologies Used

- **Manifest V3**: Latest Chrome extension standard
- **Vanilla JavaScript**: No external dependencies
- **Chrome Storage API**: Syncs settings across devices
- **Chrome Alarms API**: Reliable break scheduling
- **Content Scripts**: Full-page break overlays

### File Structure

```
workrest-balance/
├── manifest.json          # Extension configuration
├── background.js          # Service worker & scheduling logic
├── popup.html/js          # Extension popup interface
├── options.html/js        # Settings page
├── content.js/css         # Break overlay injection
└── icons/                 # Extension icons
```

### Permissions

- `storage`: Save user preferences
- `tabs`: Manage break overlays across tabs
- `alarms`: Schedule break reminders
- `<all_urls>`: Display break screen on all websites

## Customization

Want to modify the appearance? Check out these files:
- `content.css`: Break screen styling
- `popup.html`: Popup interface styles
- `options.html`: Settings page design

## Troubleshooting

**Break screen not appearing?**
- Ensure the extension has permission for the current site
- Refresh the page after installing the extension
- Check that the schedule is enabled

**Settings not saving?**
- Make sure you click "Save Settings" in the options page
- Check browser sync is enabled for cross-device settings

**Timer not accurate?**
- The browser may throttle background scripts when inactive
- Active breaks will always complete on time

## Development

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/workrest-balance.git
cd workrest-balance

# No build process needed - pure vanilla JavaScript!
```

### Making Changes

1. Edit the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Work-Rest Balance extension
4. Test your changes

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Gwynn Causing**
- GitHub: [@gwynncausing](https://github.com/gwynncausing)

## Acknowledgments

- Inspired by the Pomodoro Technique and other productivity methods
- Built to promote digital wellness and prevent burnout
- Icons designed for modern browser interfaces

## Tips for Best Results

- **20-20-20 Rule**: Every 20 minutes, look at something 20 feet away for 20 seconds
- **Stretch**: Use breaks to stretch and move your body
- **Hydrate**: Keep water nearby and drink during breaks
- **Step Away**: Leave your desk if possible during longer breaks
- **Be Consistent**: Regular breaks are more effective than occasional long ones

## Support

Having issues? Want to suggest a feature?
- Open an issue on GitHub
- Check existing issues for solutions
- Reach out to the maintainers

---

**Remember**: Taking breaks isn't being lazy—it's being productive!

Made with love to help you work smarter, not harder.
