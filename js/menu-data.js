const MENU_DATA = [
  {
    "category": "Voorgerechten",
    "items": [
      {"name": "groenten soep", "desc": "", "price": 5.0, "tags": []},
      {"name": "Miso Soep", "desc": "", "price": 5.0, "tags": []},
      {"name": "Kip-Soep", "desc": "", "price": 6.0, "tags": []},
      {"name": "Tomyum Soep", "desc": "", "price": 7.0, "tags": []},
      {"name": "Kokossoep", "desc": "", "price": 6.0, "tags": []},
      {"name": "Wonton Soep", "desc": "Niet vegetarisch", "price": 6.0, "tags": []},
      {"name": "Loempia Kip", "desc": "", "price": 6.5, "tags": []},
      {"name": "Loempia Veggie", "desc": "", "price": 4.0, "tags": ["vegetarian"]},
      {"name": "Gyoza mix", "desc": "6 stuks", "price": 8.5, "tags": []},
      {"name": "Gyoza kip", "desc": "6 stuks", "price": 7.0, "tags": []},
      {"name": "Gyoza varken", "desc": "6 stuks", "price": 7.0, "tags": []},
      {"name": "Gyoza Scampi", "desc": "6 stuks", "price": 8.5, "tags": []},
      {"name": "Gyoza mix (12st)", "desc": "12 stuks", "price": 13.5, "tags": []},
      {"name": "Dim Sum mix", "desc": "6 stuks", "price": 9.5, "tags": []},
      {"name": "Dim Sum Kip", "desc": "6 stuks", "price": 8.5, "tags": []},
      {"name": "Dim sum varken", "desc": "6 stuks", "price": 8.0, "tags": []},
      {"name": "Dim sum scampi", "desc": "6 stuks", "price": 9.5, "tags": []},
      {"name": "Ebi Fry Tempura", "desc": "", "price": 10.5, "tags": []},
      {"name": "Veggie Mix Tempura", "desc": "", "price": 6.5, "tags": ["vegetarian"]},
      {"name": "Kip Tempura", "desc": "", "price": 8.0, "tags": []},
      {"name": "Tatasuta Kip tempura", "desc": "4 stuks", "price": 8.5, "tags": []},
      {"name": "Zalm Tempura", "desc": "5 stuks", "price": 8.5, "tags": []},
      {"name": "Yakitori Kip", "desc": "2 stuks", "price": 7.5, "tags": []},
      {"name": "Edamame", "desc": "", "price": 6.0, "tags": []},
      {"name": "Wakame Salade", "desc": "Met avocado", "price": 6.5, "tags": []},
      {"name": "Scampi Friti", "desc": "6 stuks", "price": 9.5, "tags": []},
      {"name": "Crispy chicken", "desc": "", "price": 8.5, "tags": []},
      {"name": "Gefrituurde Surimi", "desc": "6 stuks", "price": 7.0, "tags": []}
    ]
  },
  {
    "category": "Sashimi",
    "category_desc": "8 STUKS",
    "items": [
      {"name": "Sashimi Zeebaars", "desc": "8 stuks", "price": 10.0, "tags": []},
      {"name": "Sashimi Zalm", "desc": "8 stuks", "price": 14.0, "tags": []},
      {"name": "Sashimi Tonijn", "desc": "8 stuks", "price": 15.0, "tags": []},
      {"name": "Sashimi Paling", "desc": "8 stuks", "price": 13.0, "tags": []},
      {"name": "Sashimi Barbeque Zalm", "desc": "8 stuks", "price": 14.0, "tags": []},
      {"name": "Sashimi Barbeque Tonijn", "desc": "8 stuks", "price": 15.0, "tags": []},
      {"name": "Sashimi mix", "desc": "4 stuks zalm, 4 stuks tonijn", "price": 16.0, "tags": []}
    ]
  },
  {
    "category": "Nigiri",
    "category_desc": "4 STUKS",
    "items": [
      {"name": "Nigiri Tamago", "desc": "4 stuks", "price": 8.5, "tags": []},
      {"name": "Nigiri Zeebaars", "desc": "4 stuks", "price": 9.5, "tags": []},
      {"name": "Nigiri Ebi", "desc": "4 stuks", "price": 9.0, "tags": []},
      {"name": "Nigiri Zalm", "desc": "4 stuks", "price": 9.0, "tags": []},
      {"name": "Nigiri Tonijn", "desc": "4 stuks", "price": 10.5, "tags": []},
      {"name": "Nigiri Paling", "desc": "4 stuks", "price": 10.5, "tags": []},
      {"name": "Nigiri Barbeque Zalm", "desc": "4 stuks", "price": 10.5, "tags": []},
      {"name": "Nigiri Barbeque Tonijn", "desc": "4 stuks", "price": 11.5, "tags": []},
      {"name": "Nigiri Krab", "desc": "4 stuks", "price": 9.5, "tags": []}
    ]
  },
  {
    "category": "Hoso Maki",
    "category_desc": "8 STUKS",
    "items": [
      {"name": "Hosso maki Komkommer", "desc": "8 stuks", "price": 6.0, "tags": ["vegetarian"]},
      {"name": "Hosso maki Avocado", "desc": "8 stuks", "price": 7.0, "tags": ["vegetarian"]},
      {"name": "Hosso maki Tamago", "desc": "8 stuks", "price": 7.0, "tags": []},
      {"name": "Hosso maki Krab", "desc": "8 stuks", "price": 8.0, "tags": []},
      {"name": "Hosso maki Mango", "desc": "8 stuks", "price": 6.0, "tags": ["vegetarian"]},
      {"name": "Hosso maki Zalm", "desc": "8 stuks", "price": 8.0, "tags": []},
      {"name": "Hosso maki Tonijn", "desc": "8 stuks", "price": 8.5, "tags": []},
      {"name": "Hoso scampi", "desc": "8 stuks", "price": 8.5, "tags": []}
    ]
  },
  {
    "category": "Hand Rolls",
    "items": [
      {"name": "HR Veggie", "desc": "1 stuk", "price": 7.0, "tags": ["vegetarian"]},
      {"name": "HR Zalm", "desc": "1 stuk", "price": 7.0, "tags": []},
      {"name": "HR Tonijn", "desc": "1 stuk", "price": 7.0, "tags": []},
      {"name": "HR Scampi", "desc": "1 stuk", "price": 7.0, "tags": []},
      {"name": "HR Paling", "desc": "1 stuk", "price": 7.0, "tags": []},
      {"name": "HR Tamago", "desc": "1 stuk", "price": 6.5, "tags": []}
    ]
  },
  {
    "category": "In Out Rolls",
    "category_desc": "8 STUKS",
    "items": [
      {"name": "In Out Zalm", "desc": "Zalm / Avocado", "price": 10.5, "tags": []},
      {"name": "In Out Tonijn", "desc": "Tonijn / Avocado", "price": 10.5, "tags": []},
      {"name": "In Out Scampi", "desc": "Scampi / Avocado", "price": 11.0, "tags": []},
      {"name": "In Out Vegetarish", "desc": "Vegetarische mix", "price": 10.5, "tags": ["vegetarian"]},
      {"name": "In Out Komkommer", "desc": "Komkommer", "price": 8.0, "tags": ["vegetarian"]},
      {"name": "In out avocado", "desc": "Avocado", "price": 9.0, "tags": ["vegetarian"]},
      {"name": "In Out Pikant Zalm", "desc": "Pikante zalm", "price": 11.0, "tags": ["spicy"]},
      {"name": "In Out Pikant tonijn", "desc": "Pikante tonijn", "price": 11.5, "tags": ["spicy"]},
      {"name": "In Out Krab Avocado", "desc": "Krab & Avocado", "price": 10.5, "tags": []},
      {"name": "In Out California", "desc": "Zalm / Komkommer", "price": 10.5, "tags": []},
      {"name": "In Out Philadelphia", "desc": "Zalm / Avocado / Philadelphia / Topping Zalm & Tonijn", "price": 10.5, "tags": []},
      {"name": "In out ura maki kip", "desc": "Gemarineerde kip met gedroogde uitjes", "price": 11.0, "tags": []},
      {"name": "In Out Ura Maki Zalm", "desc": "Gemarineerde zalm met gedroogde uitjes", "price": 10.0, "tags": []},
      {"name": "In Out Ura Maki Tonijn", "desc": "Gemarineerde tonijn met gedroogde uitjes", "price": 11.0, "tags": []},
      {"name": "In Out Barbecue Zalm", "desc": "Avocado / topping BBQ zalm", "price": 11.5, "tags": []},
      {"name": "In out crispy kip avocado", "desc": "Topping sesamzaad en masago", "price": 11.5, "tags": []},
      {"name": "in out Home roll", "desc": "Zalm met Philadelphia saus met topping mango", "price": 10.5, "tags": []},
      {"name": "in out kip rolls", "desc": "Crispy kip / topping masago", "price": 11.0, "tags": []},
      {"name": "in out omelet roll", "desc": "Tamago / avocado / komkommer / topping sesamzaad", "price": 10.5, "tags": []},
      {"name": "In out hawaii roll", "desc": "Ananas / kip / topping Tobico", "price": 11.0, "tags": []}
    ]
  },
  {
    "category": "Futomaki Rolls",
    "category_desc": "8 STUKS",
    "items": [
      {"name": "Mix Veggie Futo", "desc": "Avocado / Komkommer / Mango", "price": 8.5, "tags": ["vegetarian"]},
      {"name": "Maki Zalm", "desc": "8 stuks", "price": 9.0, "tags": []},
      {"name": "Maki Tonijn", "desc": "8 stuks", "price": 9.5, "tags": []},
      {"name": "Maki Mango", "desc": "8 stuks", "price": 8.0, "tags": ["vegetarian"]},
      {"name": "Maki Avocado", "desc": "8 stuks", "price": 7.5, "tags": ["vegetarian"]},
      {"name": "Maki Komkommer", "desc": "8 stuks", "price": 7.5, "tags": ["vegetarian"]},
      {"name": "Maki Omelet", "desc": "8 stuks", "price": 8.5, "tags": []},
      {"name": "Maki scampi tempura", "desc": "8 stuks", "price": 9.0, "tags": []},
      {"name": "Maki kip tempura", "desc": "8 stuks", "price": 8.5, "tags": []},
      {"name": "Kip Rolls", "desc": "Kip / Avocado / Komkommer / Salade", "price": 10.5, "tags": []},
      {"name": "Kamikaze Zalm", "desc": "Zalm / Crunch / Avocado / Spicy Mayo", "price": 12.0, "tags": ["spicy"]},
      {"name": "Kamikaze Tonijn", "desc": "Tonijn / Avocado / Spicy Mayo", "price": 12.5, "tags": ["spicy"]},
      {"name": "Kamikaze Scampi", "desc": "Scampi / Avocado / Spicy Mayo", "price": 12.5, "tags": ["spicy"]},
      {"name": "Sushi Dai Futo", "desc": "Zalm / Mango / Philadelphia / Komkommer / Avocado", "price": 11.0, "tags": []},
      {"name": "Merchtem Futo", "desc": "Scampi / Tamago / Zalm / Tonijn / Spicy Mayo", "price": 12.5, "tags": ["spicy"]},
      {"name": "New York Futo", "desc": "Krab / Scampi / Avocado / Komkommer / Salade", "price": 12.5, "tags": []},
      {"name": "Sky Futo", "desc": "Zalm en mango, komkommer met Philadelphia saus", "price": 11.5, "tags": []},
      {"name": "Thok Futo", "desc": "Zalm / krab / tamago / philadelphia", "price": 11.5, "tags": []}
    ]
  },
  {
    "category": "Gefrituurde Rolls",
    "category_desc": "8 STUKS",
    "items": [
      {"name": "Veggie Dragon Eye", "desc": "Gefrituurd vegetarisch", "price": 10.0, "tags": ["vegetarian"]},
      {"name": "Dragon Eye", "desc": "Klassieke gefrituurde rol", "price": 10.5, "tags": []},
      {"name": "Kip Dragon Eye", "desc": "Kip gefrituurd", "price": 10.5, "tags": []},
      {"name": "Scampi Dragon Eye", "desc": "Scampi gefrituurd", "price": 11.5, "tags": []},
      {"name": "Manhattan Dragon Eye Tonijn", "desc": "Tonijn gefrituurd", "price": 11.5, "tags": []}
    ]
  },
  {
    "category": "Chef's Special Rolls",
    "category_desc": "8 STUKS",
    "items": [
      {"name": "Green Dragon Eye", "desc": "Scampi / Avocado Roll / Topping Avocado", "price": 11.5, "tags": []},
      {"name": "Veggie Green Dragon", "desc": "Vegetarische rol met topping avocado", "price": 10.0, "tags": ["vegetarian"]},
      {"name": "Osaka Green Dragon", "desc": "Kip Rolls / Topping Avocado", "price": 11.0, "tags": []},
      {"name": "Himalayan Green Dragon", "desc": "Zalm / tonijn / komkommer / Topping Avocado", "price": 11.5, "tags": []},
      {"name": "Sexy Roll", "desc": "Pikant Tonijn / Topping Zalm, Tonijn of Avocado", "price": 11.5, "tags": ["spicy"]},
      {"name": "Rainbow Roll", "desc": "Pikant Krab / Zeebaars / Topping Zalm, Tuna, Avocado", "price": 12.0, "tags": ["spicy"]},
      {"name": "Dai Roll", "desc": "Pikante Scampi roll / Topping Paling", "price": 12.5, "tags": ["spicy"]},
      {"name": "Tokyo Roll", "desc": "Zalm Pikant / Topping Zalm", "price": 11.5, "tags": ["spicy"]},
      {"name": "Merchtem Roll", "desc": "Pikant Tuna / Topping Tuna", "price": 11.5, "tags": ["spicy"]},
      {"name": "Best Friend Roll", "desc": "Paprika / Pijpui / Topping Zalm of Tonijn", "price": 11.5, "tags": []},
      {"name": "Pink Lady Zalm", "desc": "Zalm / Avocado / Mango / Krispy / Philadelphia", "price": 11.5, "tags": []},
      {"name": "Pink Lady tonijn", "desc": "Tonijn / Avocado / Mango / Krispy / Philadelphia", "price": 12.0, "tags": []},
      {"name": "Pink Lady veggie", "desc": "Avocado / Mango / Komkommer met Philadelphia", "price": 10.0, "tags": ["vegetarian"]},
      {"name": "Tobico Met Scampi", "desc": "Avocado / scampi / topping Tobico", "price": 11.5, "tags": []},
      {"name": "Special Roll", "desc": "Scampi / avocado / topping gemarineerde zalm met barbecuesaus", "price": 12.5, "tags": []},
      {"name": "Lake roll", "desc": "Krab / komkommer / avocado / topping barbecue paling met unagi saus", "price": 10.5, "tags": []},
      {"name": "Hawa roll", "desc": "Crispy chicken / avocado / topping zeewier salade", "price": 11.5, "tags": []},
      {"name": "volcano roll", "desc": "zalm / avocado / topping tobico", "price": 12.5, "tags": []}
    ]
  },
  {
    "category": "Mix Boot",
    "items": [
      {"name": "Mix Boot 1", "desc": "22 stuks: 4 Sashimi, 4 Nigiri, 4 California, 4 Pikant Tonijn, 6 Futomaki (2 tonijn / 2 zalm / 2 scampi)", "price": 28.0, "tags": []},
      {"name": "Mix Boot 2", "desc": "44 stuks: 4 Sashimi, 4 Nigiri, 4 California, 8 Special Philadelphia, 12 Futomaki (4 tonijn / 4 zalm / 4 scampi), 8 Green Dragon Eye, 4 Dragon Eye", "price": 50.0, "tags": []},
      {"name": "Mix Boot 3", "desc": "56 stuks: 9 Sashimi (3 tonijn/3 zalm/3 zeebaars), 6 Nigiri, 8 Dragon Eye, 4 California, 4 Pikant Tonijn, 8 Philadelphia Roll, 8 Green Dragon Eye, 4 krab roll, 6 futomaki", "price": 63.0, "tags": []},
      {"name": "Belgische Boot", "desc": "61 stuks: 8 California, 6 nigiri, 6 sashimi, 8 Philadelphia, 8 scampi dragon eyes, 9 futomaki, 8 kip Rolls, 8 ura maki pikant tonijn", "price": 70.0, "tags": []},
      {"name": "Special Boot", "desc": "62 stuks: 8 kip dragon eye, 4 nigiri, 8 ura maki tonijn, 6 futomaki, 8 green dragon eye, 8 rainbow roll, 8 in out crispy chicken, 4 sashimi, 8 philadelphia", "price": 75.0, "tags": []},
      {"name": "Delux Merchtem", "desc": "72 stuks: 12 Sashimi, 12 Nigiri, 8 Hosso, 8 Dragon Eye, 8 California, 8 Pikant Tonijn, 8 Philadelphia Roll, 8 Green Dragon", "price": 85.0, "tags": []},
      {"name": "Titanic Boot", "desc": "100 stuks: 16 in out, 12 Futo Maki, 12 Sashimi, 12 Nigiri, 16 Chef Roll, 16 Hosso Maki, 16 Dragon Eye", "price": 125.0, "tags": []}
    ]
  },
  {
    "category": "Sushi Combo's",
    "items": [
      {"name": "Nigiri Combo 15 Stuks", "desc": "3 Stuks Zalm / 3 Tonijn / 3 Zeebaars / 3 Ebi / 3 Paling", "price": 25.0, "tags": []},
      {"name": "Sashimi Combo 16 Stuks", "desc": "4 Stuks Zalm / 4 Tonijn / 4 Paling / 4 Zeebaars", "price": 24.0, "tags": []},
      {"name": "Nigiri BBQ combo 16 stuks", "desc": "Diverse BBQ nigiri selectie", "price": 25.0, "tags": []},
      {"name": "Zalm Combo 16 Stuks", "desc": "4 Nigiri / 4 Sashimi / 4 in out / 4 zalm", "price": 21.0, "tags": []},
      {"name": "Tonijn Combo 16 Stuks", "desc": "4 Nigiri Tonijn / 4 Sashimi / 8 In Out Tonijn", "price": 25.0, "tags": []},
      {"name": "Zalm Tonijn Combo 16 Stuks", "desc": "4 Nigiri Zalm Tuna / 4 Pikant Tuna In Out / 4 Sashimi / 4 Zalm Tuna", "price": 23.0, "tags": []},
      {"name": "Veggie Mix Combo 24 Stuks", "desc": "Vegetarische selectie rollen en nigiri", "price": 25.0, "tags": ["vegetarian"]},
      {"name": "Dai Combo 24 Stuks", "desc": "4 Komkommer / 4 Mango / 4 Avocado / 4 Futo Zalm / 4 Tonijn / 4 Scampi", "price": 30.0, "tags": []},
      {"name": "Merchtem Combo 26 Stuks", "desc": "8 Dragon Eye / 4 California / 4 Tonijn Pikant / 4 Nigiri / 6 Futo", "price": 32.0, "tags": []},
      {"name": "Gefrituurde Combo 28 Stuks", "desc": "Veggie Dragon / Dragon Eye / Scampi Dragon Eye / Manhattan Dragon", "price": 35.0, "tags": []},
      {"name": "Hoso Combo", "desc": "Zalm / Tonijn / Komkommer / Avocado / Krab / Tamago", "price": 22.0, "tags": []},
      {"name": "Sushi Dai combo Special 30 stuks", "desc": "8 scampi dragon eye, 8 green dragon eye, 6 futomaki, 8 Chef rolls", "price": 36.0, "tags": []}
    ]
  },
  {
    "category": "Thai Curry",
    "items": [
      {"name": "Thai Curry Kip", "desc": "Met rijst of noedels", "price": 14.5, "tags": []},
      {"name": "Thai Curry Rund", "desc": "Met rijst of noedels", "price": 15.5, "tags": []},
      {"name": "Thai Curry Scampi", "desc": "Met rijst of noedels", "price": 16.5, "tags": []},
      {"name": "Thai Curry Veggie", "desc": "Met rijst of noedels", "price": 13.0, "tags": ["vegetarian"]}
    ]
  },
  {
    "category": "Teriyaki",
    "items": [
      {"name": "Teriyaki Kip", "desc": "Gewokte groenten met teriyaki sauce", "price": 19.0, "tags": []},
      {"name": "Teriyaki Rund", "desc": "Verschillende groenten met teriyaki sauce", "price": 22.5, "tags": []},
      {"name": "Teriyaki Eend", "desc": "Chopsuey groenten met teriyaki sauce", "price": 24.0, "tags": []},
      {"name": "Teriyaki Zalm", "desc": "Chopsuey groenten met teriyaki sauce", "price": 22.0, "tags": []},
      {"name": "Teriyaki Tonijn", "desc": "Chopsuey groenten met teriyaki sauce", "price": 23.5, "tags": []},
      {"name": "Teriyaki Scampi", "desc": "Chopsuey groenten met teriyaki sauce", "price": 23.5, "tags": []}
    ]
  },
  {
    "category": "Wok",
    "items": [
      {"name": "Wok Kip", "desc": "Gewokte groenten en kip", "price": 14.0, "tags": []},
      {"name": "Wok Rund", "desc": "Gewokte groenten en rundsvlees", "price": 15.0, "tags": []},
      {"name": "Wok Scampi", "desc": "Gewokte groenten en scampi", "price": 16.0, "tags": []},
      {"name": "Wok Veggie", "desc": "Gewokte seizoensgroenten", "price": 12.0, "tags": ["vegetarian"]}
    ]
  },
  {
    "category": "Pad Thai",
    "items": [
      {"name": "Pad Thai Kip", "desc": "Traditionele noedels met kip en pinda", "price": 14.0, "tags": []},
      {"name": "Pad Thai Rund", "desc": "Traditionele noedels met rundsvlees en pinda", "price": 15.0, "tags": []},
      {"name": "Pad Thai Scampi", "desc": "Traditionele noedels met scampi en pinda", "price": 16.5, "tags": []},
      {"name": "Pad Thai Veggie", "desc": "Traditionele noedels met groenten en tofu", "price": 13.0, "tags": ["vegetarian"]}
    ]
  },
  {
    "category": "Poké Bowl",
    "items": [
      {"name": "Zalm poké bowl", "desc": "Verse zalm, rijst, edamame, avocado, wakame", "price": 17.5, "tags": []},
      {"name": "Tonijn poké bowl", "desc": "Verse tonijn, rijst, edamame, avocado, wakame", "price": 19.5, "tags": []},
      {"name": "Kip poké bowl", "desc": "Crispy kip, rijst, edamame, maïs, komkommer", "price": 15.5, "tags": []},
      {"name": "Veggie poké bowl", "desc": "Tofu, avocado, edamame, wakame, radijs", "price": 15.5, "tags": ["vegetarian"]},
      {"name": "Scampi poké bowl", "desc": "Scampi, rijst, edamame, avocado, zeewier", "price": 17.5, "tags": []}
    ]
  },
  {
    "category": "Udon Noedles",
    "items": [
      {"name": "Udon Noodles Kip", "desc": "Dikke Japanse noedels met kip", "price": 13.5, "tags": []},
      {"name": "Udon Noodles Rund", "desc": "Dikke Japanse noedels met rund", "price": 14.0, "tags": []},
      {"name": "Udon Noodles Scampi", "desc": "Dikke Japanse noedels met scampi", "price": 14.5, "tags": []},
      {"name": "Udon Noodles Veggie", "desc": "Dikke Japanse noedels met groenten", "price": 11.5, "tags": ["vegetarian"]}
    ]
  },
  {
    "category": "Extra's",
    "items": [
      {"name": "Extra Gebakken Noedels", "desc": "Portie noedels", "price": 6.5, "tags": []},
      {"name": "Extra Gebakken Rijst", "desc": "Portie rijst", "price": 6.5, "tags": []},
      {"name": "Frietjes", "desc": "Krokante frietjes", "price": 4.0, "tags": []},
      {"name": "Kippenvleugels", "desc": "Krokante wings", "price": 10.5, "tags": []}
    ]
  },
  {
    "category": "Kinder Menu",
    "items": [
      {"name": "Curry Worst met frietjes", "desc": "Kindermenu", "price": 7.5, "tags": []},
      {"name": "Fish Sticks met Frietjes", "desc": "Kindermenu", "price": 6.5, "tags": []},
      {"name": "Kinder rijst met kip", "desc": "Kindermenu", "price": 6.5, "tags": []},
      {"name": "Kipfillet met frietjes", "desc": "Kindermenu", "price": 8.5, "tags": []},
      {"name": "Kippen vingers", "desc": "6 stuks met frietjes", "price": 6.0, "tags": []}
    ]
  },
  {
    "category": "Warme gerechten",
    "items": [
      {"name": "Gebakken eend met noedels of rijst", "desc": "Krokante eend", "price": 16.5, "tags": []},
      {"name": "Kip snitzel met gebakken noedels of rijst", "desc": "Met yakitori saus", "price": 15.5, "tags": []},
      {"name": "Kip curry met rijst", "desc": "Huisbereide curry", "price": 13.5, "tags": []},
      {"name": "Scampi home met rijst", "desc": "Saus in huis gemaakt", "price": 15.5, "tags": []},
      {"name": "Scampi curry met rijst", "desc": "Romige curry", "price": 16.5, "tags": []},
      {"name": "Fish and Chips", "desc": "Met pikante mayonaise", "price": 14.5, "tags": []},
      {"name": "Chicken chili met rijst", "desc": "Zoet-pikante kip", "price": 13.5, "tags": []},
      {"name": "Scampi chili met rijst", "desc": "Zoet-pikante scampi", "price": 15.5, "tags": []}
    ]
  },
  {
    "category": "Gefrituurde Sushi sandwich",
    "category_desc": "Zeewier buitenkant met rijst en vis binnen. Gefrituurd (geen brood)",
    "items": [
      {"name": "Gefrituurde sushi sandwich Zalm", "desc": "4 stuks", "price": 11.5, "tags": []},
      {"name": "Gefrituurde sushi sandwich tonijn", "desc": "4 stuks", "price": 13.5, "tags": []},
      {"name": "Gefrituurde sushi sandwich scampi", "desc": "4 stuks", "price": 13.5, "tags": []},
      {"name": "Gefrituurde sushi sandwich kip", "desc": "4 stuks", "price": 11.5, "tags": []},
      {"name": "Gefrituurde sushi sandwich tamago", "desc": "4 stuks", "price": 10.0, "tags": []},
      {"name": "Gefrituurde HR sandwich zalm", "desc": "1 stuk", "price": 6.5, "tags": []},
      {"name": "Gefrituurde HR sandwich Scampi", "desc": "1 stuk", "price": 7.0, "tags": []}
    ]
  },
  {
    "category": "Sushi Sandwich",
    "category_desc": "Zeewier buitenkant met rijst en vis binnen. Geen brood.",
    "items": [
      {"name": "Sushi sandwich zalm", "desc": "4 stuks", "price": 11.0, "tags": []},
      {"name": "Sushi sandwich Tonijn", "desc": "4 stuks", "price": 12.5, "tags": []},
      {"name": "Sushi sandwich scampi", "desc": "4 stuks", "price": 13.0, "tags": []},
      {"name": "Sushi sandwich tamago", "desc": "4 stuks", "price": 11.5, "tags": []}
    ]
  }
];
