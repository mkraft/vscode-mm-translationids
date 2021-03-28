# VSCode MM Translation IDs

This VSCode extension is for use during Mattermost server development. It adds a command to VSCode that takes the selected text, or if no text is selected it uses the text from the clipboad, and searches for a matching translation ID in i18n/en.json. If there's a match, it performs a search for all *.go files that match the translation ID.

## Build

```
$ npm install vsce
$ vsce package
$ code --install-extension ./showtranslationinstances-0.0.1.vsix
```