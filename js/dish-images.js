/* Dish name -> photo, one entry per menu item (193 items, 22 photo groups).
   Drop the 22 files named below into DISH_PHOTO_DIR. While a file is missing, the card
   falls back to its category photo from Assets/Images (see dishPhotoStyle in app.js). */
(function (global) {
  'use strict';

  const DISH_PHOTO_DIR = 'Assets/Images/Sushi deelcategorieen/';

  /* Group key below -> real file name in DISH_PHOTO_DIR. */
  const DISH_PHOTO_FILES = {
    'spring-rolls.jpg': 'Loempias.png',
    'tempura-crispy.jpg': 'Tempura en krokante bites.png',
    'dumplings-gyoza.jpg': 'Demplings (gyoza en Dim Sum.png',
    'yakitori-skewers.jpg': 'Japanse Spiesjes (yakitori).png',
    'cold-starters.jpg': 'Koude voorgerechten (wakame en edamame).png',
    'soups.jpg': 'Aziatische soepe.png',
    'noodles-wok.jpg': 'Wok & Noedels.png',
    'curry-rice.jpg': "Curry's & Warme Rijstgerechten.png",
    'teriyaki.jpg': 'Teriyaki Gerechten.png',
    'poke-bowls.jpg': 'Poké Bowls.jpeg',
    'sashimi.jpg': 'Sashimi.png',
    'nigiri.jpg': 'Nigiri.png',
    'hoso-maki.jpg': 'Hoso Maki.png',
    'hand-rolls.jpg': 'Hand Rolls (Temaki).png',
    'in-out-rolls.jpg': 'In Out Rolls (Uramaki).png',
    'futomaki.jpg': 'Futomaki Rolls.png',
    'fried-rolls.jpg': 'Gefrituurde Sushi Rolls (Dragon Eyes).png',
    'special-rolls.jpg': "Chef's Special Rolls.png",
    'sushi-sandwiches.jpg': 'Sushi Sandwiches (Onigirazu).png',
    'sushi-combos.jpg': 'Sushi Combo Boxen.png',
    'sushi-boats.jpg': 'Grote Sushi Boten (Party Platters).png',
    'fried-snacks-kids.jpg': 'Frituur & Kindermenu Snacks.png'
  };

  const DISH_PHOTO_GROUPS = {
    /* Loempia's */
    'spring-rolls.jpg': [
      'Loempia Kip',
      'Loempia Veggie'
    ],
    /* Tempura & Krokante Bites */
    'tempura-crispy.jpg': [
      'Ebi Fry Tempura',
      'Veggie Mix Tempura',
      'Kip Tempura',
      'Tatasuta Kip tempura',
      'Zalm Tempura',
      'Scampi Friti',
      'Crispy chicken',
      'Gefrituurde Surimi',
      'Kip snitzel met gebakken noedels of rijst'
    ],
    /* Dumplings / Gyoza & Dim Sum */
    'dumplings-gyoza.jpg': [
      'Gyoza mix',
      'Gyoza kip',
      'Gyoza varken',
      'Gyoza Scampi',
      'Gyoza mix (12st)',
      'Dim Sum mix',
      'Dim Sum Kip',
      'Dim sum varken',
      'Dim sum scampi'
    ],
    /* Japanse Spiesjes */
    'yakitori-skewers.jpg': [
      'Yakitori Kip'
    ],
    /* Koude Voorgerechten & Salades */
    'cold-starters.jpg': [
      'Edamame',
      'Wakame Salade'
    ],
    /* Aziatische Soepen */
    'soups.jpg': [
      'groenten soep',
      'Miso Soep',
      'Kip-Soep',
      'Tomyum Soep',
      'Kokossoep',
      'Wonton Soep'
    ],
    /* Wok & Noedels */
    'noodles-wok.jpg': [
      'Pad Thai Kip',
      'Pad Thai Rund',
      'Pad Thai Scampi',
      'Pad Thai Veggie',
      'Udon Noodles Kip',
      'Udon Noodles Rund',
      'Udon Noodles Scampi',
      'Udon Noodles Veggie',
      'Wok Kip',
      'Wok Rund',
      'Wok Scampi',
      'Wok Veggie',
      'Extra Gebakken Noedels',
      'Gebakken eend met noedels of rijst'
    ],
    /* Curry's & Warme Rijstgerechten */
    'curry-rice.jpg': [
      'Thai Curry Kip',
      'Thai Curry Rund',
      'Thai Curry Scampi',
      'Thai Curry Veggie',
      'Kip curry met rijst',
      'Scampi home met rijst',
      'Scampi curry met rijst',
      'Chicken chili met rijst',
      'Scampi chili met rijst',
      'Extra Gebakken Rijst'
    ],
    /* Teriyaki Gerechten */
    'teriyaki.jpg': [
      'Teriyaki Kip',
      'Teriyaki Rund',
      'Teriyaki Eend',
      'Teriyaki Zalm',
      'Teriyaki Tonijn',
      'Teriyaki Scampi'
    ],
    /* Poké Bowls */
    'poke-bowls.jpg': [
      'Zalm poké bowl',
      'Tonijn poké bowl',
      'Kip poké bowl',
      'Veggie poké bowl',
      'Scampi poké bowl'
    ],
    /* Sashimi */
    'sashimi.jpg': [
      'Sashimi Zeebaars',
      'Sashimi Zalm',
      'Sashimi Tonijn',
      'Sashimi Paling',
      'Sashimi Barbeque Zalm',
      'Sashimi Barbeque Tonijn',
      'Sashimi mix'
    ],
    /* Nigiri */
    'nigiri.jpg': [
      'Nigiri Tamago',
      'Nigiri Zeebaars',
      'Nigiri Ebi',
      'Nigiri Zalm',
      'Nigiri Tonijn',
      'Nigiri Paling',
      'Nigiri Barbeque Zalm',
      'Nigiri Barbeque Tonijn',
      'Nigiri Krab'
    ],
    /* Hoso Maki */
    'hoso-maki.jpg': [
      'Hosso maki Komkommer',
      'Hosso maki Avocado',
      'Hosso maki Tamago',
      'Hosso maki Krab',
      'Hosso maki Mango',
      'Hosso maki Zalm',
      'Hosso maki Tonijn',
      'Hoso scampi'
    ],
    /* Hand Rolls / Temaki */
    'hand-rolls.jpg': [
      'HR Veggie',
      'HR Zalm',
      'HR Tonijn',
      'HR Scampi',
      'HR Paling',
      'HR Tamago'
    ],
    /* In Out Rolls / Uramaki */
    'in-out-rolls.jpg': [
      'In Out Zalm',
      'In Out Tonijn',
      'In Out Scampi',
      'In Out Vegetarish',
      'In Out Komkommer',
      'In out avocado',
      'In Out Pikant Zalm',
      'In Out Pikant tonijn',
      'In Out Krab Avocado',
      'In Out California',
      'In Out Philadelphia',
      'In out ura maki kip',
      'In Out Ura Maki Zalm',
      'In Out Ura Maki Tonijn',
      'In Out Barbecue Zalm',
      'In out crispy kip avocado',
      'in out Home roll',
      'in out kip rolls',
      'in out omelet roll',
      'In out hawaii roll'
    ],
    /* Futomaki Rolls */
    'futomaki.jpg': [
      'Mix Veggie Futo',
      'Maki Zalm',
      'Maki Tonijn',
      'Maki Mango',
      'Maki Avocado',
      'Maki Komkommer',
      'Maki Omelet',
      'Maki scampi tempura',
      'Maki kip tempura',
      'Kip Rolls',
      'Kamikaze Zalm',
      'Kamikaze Tonijn',
      'Kamikaze Scampi',
      'Sushi Dai Futo',
      'Merchtem Futo',
      'New York Futo',
      'Sky Futo',
      'Thok Futo'
    ],
    /* Gefrituurde Sushi Rolls / Dragon Eyes */
    'fried-rolls.jpg': [
      'Veggie Dragon Eye',
      'Dragon Eye',
      'Kip Dragon Eye',
      'Scampi Dragon Eye',
      'Manhattan Dragon Eye Tonijn'
    ],
    /* Chef's Special Rolls */
    'special-rolls.jpg': [
      'Green Dragon Eye',
      'Veggie Green Dragon',
      'Osaka Green Dragon',
      'Himalayan Green Dragon',
      'Sexy Roll',
      'Rainbow Roll',
      'Dai Roll',
      'Tokyo Roll',
      'Merchtem Roll',
      'Best Friend Roll',
      'Pink Lady Zalm',
      'Pink Lady tonijn',
      'Pink Lady veggie',
      'Tobico Met Scampi',
      'Special Roll',
      'Lake roll',
      'Hawa roll',
      'volcano roll'
    ],
    /* Sushi Sandwiches / Onigirazu */
    'sushi-sandwiches.jpg': [
      'Gefrituurde sushi sandwich Zalm',
      'Gefrituurde sushi sandwich tonijn',
      'Gefrituurde sushi sandwich scampi',
      'Gefrituurde sushi sandwich kip',
      'Gefrituurde sushi sandwich tamago',
      'Gefrituurde HR sandwich zalm',
      'Gefrituurde HR sandwich Scampi',
      'Sushi sandwich zalm',
      'Sushi sandwich Tonijn',
      'Sushi sandwich scampi',
      'Sushi sandwich tamago'
    ],
    /* Sushi Combo Boxen */
    'sushi-combos.jpg': [
      'Nigiri Combo 15 Stuks',
      'Sashimi Combo 16 Stuks',
      'Nigiri BBQ combo 16 stuks',
      'Zalm Combo 16 Stuks',
      'Tonijn Combo 16 Stuks',
      'Zalm Tonijn Combo 16 Stuks',
      'Veggie Mix Combo 24 Stuks',
      'Dai Combo 24 Stuks',
      'Merchtem Combo 26 Stuks',
      'Gefrituurde Combo 28 Stuks',
      'Hoso Combo',
      'Sushi Dai combo Special 30 stuks'
    ],
    /* Grote Sushi Boten / Party Platters */
    'sushi-boats.jpg': [
      'Mix Boot 1',
      'Mix Boot 2',
      'Mix Boot 3',
      'Belgische Boot',
      'Special Boot',
      'Delux Merchtem',
      'Titanic Boot'
    ],
    /* Frituur & Kindermenu Snacks */
    'fried-snacks-kids.jpg': [
      'Curry Worst met frietjes',
      'Fish Sticks met Frietjes',
      'Kinder rijst met kip',
      'Kipfillet met frietjes',
      'Kippen vingers',
      'Fish and Chips',
      'Frietjes',
      'Kippenvleugels'
    ]
  };

  /* dishImageMap[dishName] -> photo path, built once from the groups above. */
  const dishImageMap = {};
  Object.keys(DISH_PHOTO_GROUPS).forEach((file) => {
    DISH_PHOTO_GROUPS[file].forEach((name) => {
      dishImageMap[name] = DISH_PHOTO_DIR + (DISH_PHOTO_FILES[file] || file);
    });
  });

  global.DISH_PHOTO_DIR = DISH_PHOTO_DIR;
  global.dishImageMap = dishImageMap;
})(window);