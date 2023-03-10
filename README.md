# AMC App

## Build Instructions

1. `cd` into the project directory and run `yarn install`.
2. Install "Expo Go" mobile app on your phone.
3. Run `yarn expo:start` (or `yarn expo:start --tunnel`).
4. Follow the instructions in console to connect your Expo Go app.

## Usage Instructions

### Home Screen

The home screen will show a traffic indicator (high, medium, or low) for the traffic for the current hour. It will also show up to 3 of the next showtimes for the day. Currently the traffic indicator is hardcoded as "high", since I wasn't able to get access to the AMC API.

### Usher Screen

The usher screen will present you with a list of all showtimes for the day. You can switch between sorting on start time, end time, and movie name with the three buttons at the top. There is also a switch for toggling upcoming showtimes only, which will filter out movies already started when sorting by start time, and filter out movies already ended when sorting by end time. Showtime cards display a time remaining message in the top right corner, which will be the time until the movie starts if it hasn't started yet, or the time until the movie ends if it has already started.

### Traffic Screen

WIP

### Break Finder Screen

WIP

## ./app directory

Included in an Ignite boilerplate project is the `app` directory. This is a directory you would normally have to create when using vanilla React Native.

The inside of the `app` directory looks similar to the following:

```
app
├── components
├── config
├── i18n
├── models
├── navigators
├── screens
├── services
├── theme
├── utils
├── app.tsx
```

**components**
This is where your reusable components live which help you build your screens.

**i18n**
This is where your translations will live if you are using `react-native-i18n`.

**models**
This is where your app's models will live. Each model has a directory which will contain the `mobx-state-tree` model file, test file, and any other supporting files like actions, types, etc.

**navigators**
This is where your `react-navigation` navigators will live.

**screens**
This is where your screen components will live. A screen is a React component which will take up the entire screen and be part of the navigation hierarchy. Each screen will have a directory containing the `.tsx` file, along with any assets or other helper files.

**services**
Any services that interface with the outside world will live here (think REST APIs, Push Notifications, etc.).

**theme**
Here lives the theme for your application, including spacing, colors, and typography.

**utils**
This is a great place to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truly shared across your application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.

**app.tsx** This is the entry point to your app. This is where you will find the main App component which renders the rest of the application.

### ./ignite directory

The `ignite` directory stores all things Ignite, including CLI and boilerplate items. Here you will find templates you can customize to help you get started with React Native.

### ./test directory

This directory will hold your Jest configs and mocks.
