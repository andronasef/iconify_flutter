Before starting ✋. I want to tell you that every star 🌟 added to my space shines my world and motivate me 💪 to make more awesome things like this one so please don't forget to give me a star and like the project.

<h1 align="center">Iconify Flutter</h1>
<a href="https://andronasef.ninja/iconify_flutter/"><img src="https://github.com/andronasef/iconify_flutter/raw/master/website/screenshots/1.png"/></a>

<div align="center" style="margin-top:10px"> 
  
[![likes](https://badges.bar/iconify_flutter/likes)](https://pub.dev/packages/iconify_flutter/score)
[![GitHub stars](https://img.shields.io/github/stars/andronasef/iconify_flutter.svg?style=flat&label=Star&maxAge=36&logo=github&color=success)](https://github.com/andronasef/iconify_flutter/)
[![HitCount](https://hits.dwyl.com/andronasef/iconify_flutter.svg?style=flat)](https://hits.dwyl.com/andronasef/iconify_flutter)

</div>

<p align="center">Not just another icon library. it's +100 open source iconsets to make your flutter apps more beautiful.</p>

## How to use? 🤔

As easy as this

```dart
import 'package:iconify_flutter/iconify_flutter.dart';
import 'package:iconify_flutter/icons/zondicons.dart'; // for Non Colorful Icons
import 'package:colorful_iconify_flutter/icons/emojione.dart'; // for Colorful Icons
....


Iconify(Zondicons.airplane)
Iconify(Emojione.baby)
// as widgets
```

## Discover All Icons 🕵️

To explore all the icons, [Click Here](https://andronasef.github.io/iconify_flutter)

## How to use svg as icon with iconify ✏️

```dart
import 'package:iconify_flutter/iconify_flutter.dart';

....

const String svgIcon =
'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="#000000" d="M3 3h18v18H3z"></path></svg>
' // svg file as string

Iconify(svgIcon) // as a widget
```

## Get list of all icons of specific icon set 📋

```dart
import 'package:iconify_flutter/icons/zondicons.dart';

...
Zondicons.iconsList // List of all icons of VS Code icon set
```

## Important Note ❗

All icon sets are free but Some collections require attribution when used for commercial purposes. See [This List](https://github.com/iconify/icon-sets/blob/master/collections.md) of collections and their licenses.

## Thanks to 🙏

[@cyberalien](https://github.com/cyberalien) for his awesome icon framework [Iconify](https://github.com/iconify) which this package based on

[@antfu](https://github.com/antfu) for his site [icones](https://github.com/antfu/icones)

[@IconDesigners](https://github.com/iconify/icon-sets/blob/master/collections.md) who own icon sets

[@You](https://www.reactiongifs.us/wp-content/uploads/2019/03/Thank-U.gif) for using this package and supporting me by sharing it among the flutter community

## Dreams 💭

- [ ] Get first 100 likes on [pub.dev](https://pub.dev/packages/iconify_flutter/)
- [ ] Get first 100 stars on [github.com](https://github.com/andronasef/iconify_flutter/)
- [ ] Add tests to package
- [ ] Get Flutter Favourite Badge
- [x] Add colorful icons to iconify_flutter
