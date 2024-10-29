# MMM-FostPlus-RecyclingCalendar

This module displays a recycling calendar for a specific Belgian region

This module is an extension of the [MagicMirror² project](https://github.com/MichMich/MagicMirror).

## Screenshot

![Screenshot](./screenshots/img.png)

## Installation

1. Navigate into your MagicMirror's modules folder
2. Execute: `git clone https://github.com/MaartenGVS/MMM-FostPlus-RecyclingCalendar`
3. Navigate to the MMM-FostPlus-RecyclingCalendar directory: cd MMM-FostPlus-RecyclingCalendar`
4. Add [config](https://github.com/MaartenGVS/MMM-FostPlus-RecyclingCalendar#configuration)
5. Done

## Configuration

Sample configuration entry for your `~/MagicMirror/config/config.js`:

```
{
    module: "MMM-FostPlus-RecyclingCalendar",
    position: "bottom_right",
    config: {
        language: "en",
        zipcode: "8500",
        streetName: "Sint-Martens-Latemlaan",
        streetNumber: "2",
    }
},
```

## Configuration options

The following properties can be configured:

| Key          | Description                      |        Default         |        Example         |
|--------------|----------------------------------|:----------------------:|:----------------------:|
| language     | The language of the module       |           en           |           en           |
| zipcode      | The zipcode of the address       |          8500          |          8500          |
| streetName   | The street name of the address   | Sint-Martens-Latemlaan | Sint-Martens-Latemlaan |
| streetNumber | The street number of the address |           2            |           2            |

## Dependencies

This module is using the [Fost Plus API](https://api.fostplus.be/recyclecms/public/v1).

## Report bugs

You can report bugs
here: [https://github.com/MaartenGVS/MMM-FostPlus-RecyclingCalendar/issues](https://github.com/MaartenGVS/MMM-FostPlus-RecyclingCalendar/issues)
