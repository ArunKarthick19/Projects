  // Initialize with station markers - only position and styling
  const stationMarkers = [
    // RED LINE
    {
      "code": "NS2", //bukitbatok
      "position": { x: 61.5, y: 130 },  
      "style": {
        width: 25,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW24NS1", //JE
      "position": { x: 61.5, y: 153 },  
      "style": {
        width: 13,
        height: 8,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 2,
      }
    },
    {
      "code": "NS3", //Gombak
      "position": { x: 61.5, y: 113 },  
      "style": {
        width: 25,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS4BP1", //CCK
      "position": { x: 61.5, y: 93 },  
      "style": {
        width: 20,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS5", //yewtee
      "position": { x: 61.5, y: 73 },  
      "style": {
        width: 10,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS7", //kranji
      "position": { x: 61.5, y: 53},  
      "style": {
        width: 10,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS8", //marsiling
      "position": { x: 73, y: 30 },  
      "style": {
        width: 10,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS9TE2", //woodlands
      "position": { x: 98, y: 24.5},  
      "style": {
        width: 15,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS10", //admiralty
      "position": { x: 118, y: 24.5 },  
      "style": {
        width: 10,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS11", //sembawang
      "position": { x: 133, y: 24.5 },  
      "style": {
        width: 10,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS12", //canberra
      "position": { x: 148, y: 24.5 },  
      "style": {
        width: 10,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS13", //yishun
      "position": { x: 165, y: 30.5 },  
      "style": {
        width: 18,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS14", //khatib
      "position": { x: 175, y: 41 },  
      "style": {
        width: 15,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS15", //yiochukang
      "position": { x: 175, y: 53 },  
      "style": {
        width: 26,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS16", //angmokio
      "position": { x: 175, y: 65 },  
      "style": {
        width: 25,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS17CC15", //bishan
      "position": { x: 173, y: 76 },  
      "style": {
        width: 15,
        height: 9,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS18", //braddel
      "position": { x: 165, y: 81 },  
      "style": {
        width: 18,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS19", //toapayoh
      "position": { x: 175, y: 87 },  
      "style": {
        width: 22,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS20", //novena
      "position": { x: 175, y: 98 },  
      "style": {
        width: 16,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS21DT11", //newton
      "position": { x: 160, y: 120 },  
      "style": {
        width: 18,
        height: 8,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS22TE14", //Orchard
      "position": { x: 140, y: 139 },  
      "style": {
        width: 23,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS23", //somerset
      "position": { x: 160, y: 151 },  
      "style": {
        width: 18,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS24NE6CC1", //dhouby ghaut
      "position": { x: 172, y: 160 },  
      "style": {
        width: 20,
        height: 10,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS25EW13", //city hall
      "position": { x: 195, y: 193 },  
      "style": {
        width: 17,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW14NS26", //raffles place
      "position": { x: 197, y: 204 },  
      "style": {
        width: 16,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NS27TE20CE2", //marina bay
      "position": { x: 202, y: 221}, 
      "style": {
        width: 21,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    // GREEN LINE
    {
      "code": "EW33", // Tuas Link
      "position": { x: 25, y: 78 }, 
      "style": {
        width: 23,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW32", // Tuas West Road
      "position": { x: 25, y: 89 }, 
      "style": {
        width: 26,
        height: 4,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW31", // Tuas Cresecent
      "position": { x: 25, y: 98 }, 
      "style": {
        width: 24,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW30", // Gul Circle
      "position": { x: 25, y: 108 }, 
      "style": {
        width: 19,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW29", // Joo Koon
      "position": { x: 25, y: 120 }, 
      "style": {
        width: 20,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW28", //Pioneer
      "position": { x: 25, y: 132 }, 
      "style": {
        width: 16,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW27", // Boon Lay
      "position": { x: 22, y: 140 }, 
      "style": {
        width: 23,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW26", // Lake Side
      "position": { x: 35, y: 155 }, 
      "style": {
        width: 10,
        height: 7,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW25", //Chinese Garden
      "position": { x: 49, y: 155 }, 
      "style": {
        width: 10,
        height: 7,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //skip JE, its in red
    {
      "code": "EW23", // Clementi
      "position": { x: 79, y: 155 }, 
      "style": {
        width: 10,
        height: 7,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW22", //Dover
      "position": { x: 92, y: 155 }, 
      "style": {
        width: 8,
        height: 7,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW21CC22", // Bouna Vista
      "position": { x: 102, y: 153 }, 
      "style": {
        width: 15,
        height: 7,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW20", // Commonwealth
      "position": { x: 117, y: 162 }, 
      "style": {
        width: 25,
        height: 4,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW19", // queenstown
      "position": { x: 124, y: 168 }, 
      "style": {
        width: 20,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW18", // redhill
      "position": { x: 129, y: 177 }, 
      "style": {
        width: 12,
        height: 4,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW17", // tiong bahru
      "position": { x: 128, y: 185 }, 
      "style": {
        width: 20,
        height: 4,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW16NE3TE17", // outram park
      "position": { x: 135, y: 194 }, 
      "style": {
        width: 35,
        height: 4,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW15", // tanjong pagar
      "position": { x: 160, y: 210}, 
      "style": {
        width: 15,
        height: 8,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW12DT14", // Bugis
      "position": { x: 217, y: 173.5}, 
      "style": {
        width: 18,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW11", // Lavender 
      "position": { x: 230, y: 164}, 
      "style": {
        width: 18,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW10", // kallang
      "position": { x: 237, y: 156}, 
      "style": {
        width: 18,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW9", // Aljunied
      "position": { x: 235, y: 148}, 
      "style": {
        width: 18,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW8CC9", // payar lebar
      "position": { x: 252, y: 138}, 
      "style": {
        width: 27,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW7", // Eunos
      "position": { x: 267, y: 126}, 
      "style": {
        width: 18,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW6", // Kembangan
      "position": { x: 280, y: 115}, 
      "style": {
        width: 22,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW5", // Bedok
      "position": { x: 292, y: 106}, 
      "style": {
        width: 12,
        height: 8,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW4", // tanah merah
      "position": { x: 313, y: 106}, 
      "style": {
        width: 18,
        height: 8,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW3", // simei
      "position": { x: 315, y: 98}, 
      "style": {
        width: 14,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW2DT32", // tampines
      "position": { x: 321, y: 88}, 
      "style": {
        width: 15,
        height: 9,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "EW1", // pasir ris
      "position": { x: 321, y: 78}, 
      "style": {
        width: 20,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //Yellow, Circle Line
    //dhouby covered in red line (NS24NE6CC1)
    {
      "code": "CC2", // bras basah
      "position": { x: 195, y: 175}, 
      "style": {
        width: 16,
        height: 8,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CC3", // esplanade
      "position": { x: 218, y: 192}, 
      "style": {
        width: 20,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //promenade is in Downtown (CC4)
    {
      "code": "CC5", // nicoll highway
      "position": { x: 250, y: 185}, 
      "style": {
        width: 22,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CC6", // stadium
      "position": { x: 255, y: 176}, 
      "style": {
        width: 20,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CC7", // mountbatten
      "position": { x: 258, y: 164}, 
      "style": {
        width: 22,
        height: 6,
        backgroundColor: '#333333',
        opacity:0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CC8", // dakota
      "position": { x: 257, y: 152}, 
      "style": {
        width: 18,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //paya lebar covered in green (CC9)
    //macpherson covered in downtown (DT26)
    {
      "code": "CC11", // Tai Send
      "position": { x: 243, y: 108}, 
      "style": {
        width: 18,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CC12", // bartley
      "position": { x: 233, y: 97}, 
      "style": {
        width: 16,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //Serangoon covered in purple (NE12CC13)
    {
      "code": "CC14", //lorong chuan
      "position": { x: 195, y: 78}, 
      "style": {
        width: 16,
        height: 8,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //bishan covered in red line (NS17CC15)
    {
      "code": "CC16", // marymount
      "position": { x: 153, y: 80},
      "style": {
        width: 16,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CC17TE9", // caldecott
      "position": { x: 129, y: 88}, 
      "style": {
        width: 26,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CC19DT9", // botanic gardens
      "position": { x: 115, y: 109}, 
      "style": {
        width: 16,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CC20", // farrer road
      "position": { x: 100, y: 125}, 
      "style": {
        width: 22,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CC21", // holland
      "position": { x: 90, y: 137}, 
      "style": {
        width: 25,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //bouna visa covered in green line (CC22EW21)
    {
      "code": "CC23", // one north
      "position": { x: 95, y: 164}, 
      "style": {
        width: 20,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CC24", // kent ridge
      "position": { x: 96, y: 175}, 
      "style": {
        width: 22,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CC25", // haw par villa
      "position": { x: 97, y: 185}, 
      "style": {
        width: 24,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CC26", // pasir panjang
      "position": { x: 103, y: 195}, 
      "style": {
        width: 23,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CC27", // labrador park
      "position": { x: 111, y: 205}, 
      "style": {
        width: 24,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CC28", // telok blangah
      "position": { x: 117, y: 213}, 
      "style": {
        width: 25,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CC29NE1", // harbourfront
      "position": { x:140, y: 223}, 
      "style": {
        width: 24,
        height: 12,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //Purple Line
    //harbourfront covered in circle line (CC29NE1)
    //outram park covered in green line (EW16NE3TE17)
    {
      "code": "NE4DT19", // chinatown
      "position": { x: 165, y: 183}, 
      "style": {
        width: 25,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NE5", // clarke quay
      "position": { x: 170, y: 177}, 
      "style": {
        width: 18,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //dhouby ghout covered in red line (NS24NE6CC1)
    {
      "code": "NE7DT12", //little india
      "position": { x: 183, y: 141}, 
      "style": {
        width: 22,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NE8", //farrer park
      "position": { x: 188, y: 129}, 
      "style": {
        width: 22,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NE9", //boon keng
      "position": { x: 188, y: 120}, 
      "style": {
        width: 22,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NE10", //potong pasir
      "position": { x: 197, y: 107}, 
      "style": {
        width: 22,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NE11", //woodleigh
      "position": { x: 205, y: 97}, 
      "style": {
        width: 20,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NE12CC13", //serangoon
      "position": { x: 212, y:86}, 
      "style": {
        width: 28,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NE13", //kovan
      "position": { x: 218, y: 77},
      "style": {
        width: 16,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NE14", //hougang
      "position": { x: 224, y: 69}, 
      "style": {
        width: 22,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NE15", //buangkok
      "position": { x: 228, y: 62}, 
      "style": {
        width: 22,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NE16", //sengkang
      "position": { x: 234, y: 54}, 
      "style": {
        width: 26,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NE17", //punggol
      "position": { x: 263, y:36}, 
      "style": {
        width: 18,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "NE18", //punggol coast
      "position": { x: 270, y: 30}, 
      "style": {
        width: 20,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //Brown Line (TE)
    {
      "code": "TE1", //Woodlands north
      "position": { x: 94, y: 13}, 
      "style": {
        width: 26,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //woodlands covered in red line (NS9TE2)
    {
      "code": "TE3", //Woodlands south
      "position": { x: 107, y: 32}, 
      "style": {
        width: 26,
        height: 6,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE4", //Springleaf
      "position": { x: 116, y: 40}, 
      "style": {
        width: 19,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE5", //Lentor
      "position": { x: 121, y: 48}, 
      "style": {
        width: 16,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE6", //mayflower
      "position": { x: 130, y: 55.5}, 
      "style": {
        width: 19,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE7", //bright hill
      "position": { x: 137, y: 63}, 
      "style": {
        width: 19,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE8", //upper thomson
      "position": { x: 126, y: 76}, 
      "style": {
        width: 25,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //Caldecott covered in circle line (CC17TE9)
    //Stevens covered in downtown line (DT10TE11)
    {
      "code": "TE12", //napier
      "position": { x: 145, y: 120}, 
      "style": {
        width: 14,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE13", //orchard boulevard
      "position": { x:123, y: 130}, 
      "style": {
        width: 27,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //Orchard is covered in red line (TE14NS22)
    {
      "code": "TE15", //great world
      "position": { x: 127, y: 150}, 
      "style": {
        width: 21,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE16", //havelock
      "position": { x: 145, y: 160}, 
      "style": {
        width: 18,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //outram park covered in green line
    {
      "code": "TE18", //maxwell
      "position": { x: 170, y: 200}, 
      "style": {
        width: 17,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE19", //shenton way
      "position": { x: 173, y: 217}, 
      "style": {
        width: 22,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //Marina Bay covered in red line
    {
      "code": "TE22", //gardens by the bay
      "position": { x: 255, y: 213}, 
      "style": {
        width: 28,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE23", //tanjong rhu
      "position": { x: 270, y:194}, 
      "style": {
        width: 21,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE24", //katong park
      "position": { x: 278, y:187}, 
      "style": {
        width: 21,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE25", //tanjong katong
      "position": { x: 290, y:180}, 
      "style": {
        width: 24,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE26", //marine parade
      "position": { x: 298, y:173}, 
      "style": {
        width: 24,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE27", //marine terrace
     "position": { x: 300, y:166}, 
      "style": {
        width: 25,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE28", //siglap
      "position": { x: 310, y:158}, 
      "style": {
        width: 16,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE29", //bayshore
      "position": { x: 315, y:151}, 
      "style": {
        width: 17,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE30", //bedok south
      "position": { x: 320, y:145}, 
      "style": {
        width: 25,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "TE31DT37", //sungei bedok
      "position": { x: 328, y:136}, 
      "style": {
        width: 22,
        height: 8,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //Blue line
    {
      "code": "DT1BP6", //bukit panjang
      "position": { x: 90, y: 59 },  
      "style": {
        width: 9,
        height: 10,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT2", //cashew
      "position": { x: 90, y: 72 },  
      "style": {
        width: 14,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT3", //hillview
      "position": { x: 90, y: 78 },  
      "style": {
        width: 15,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT4", //hume
      "position": { x: 90, y: 83 },  
      "style": {
        width: 14,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT5", //beauty world
      "position": { x: 90, y: 88 },  
      "style": {
        width: 22,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT6", //king albert park
      "position": { x: 90, y: 94 },  
      "style": {
        width: 24,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT7", //sixth avenue
      "position": { x: 90, y: 100 },  
      "style": {
        width: 22,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT8", //tan kah kee
      "position": { x: 102, y: 110 },  
      "style": {
        width: 8,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //botanic gardens coverd in circle line
    {
      "code": "DT10TE11", //stevens
      "position": { x: 139, y: 110 },  
      "style": {
        width: 16,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //newton covered in red line
    //little india covered in purple line
    {
      "code": "DT13", //rocher
      "position": { x: 200, y: 152 },  
      "style": {
        width: 16,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //bugis covered in green line
    {
      "code": "DT15CC4", //promenade
      "position": { x: 240, y: 199 },  
      "style": {
        width: 25,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT16CE1", //bayfront
      "position": { x: 223, y: 213 },  
      "style": {
        width: 23,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT17", //downtown
      "position": { x: 198, y: 204 },  
      "style": {
        width: 10,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT18", //telok ayer
      "position": { x: 182, y: 207 },  
      "style": {
        width: 10,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //chinatown covered in purple line
    {
      "code": "DT20", //fort canning
      "position": { x: 152, y: 170 },  
      "style": {
        width: 22,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT21", //bencoolen
      "position": { x: 197, y: 165.1 },  
      "style": {
        width: 16,
        height: 7,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT22", //jalan besar
      "position": { x: 215, y: 158 },  
      "style": {
        width: 20,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT23", //bendemeer
      "position": { x: 215, y: 147 },  
      "style": {
        width: 20,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT24", //geylang bahru
      "position": { x: 220, y: 139 },  
      "style": {
        width: 23,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT25", //mattar
      "position": { x: 235, y: 129 },  
      "style": {
        width: 16,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT26CC10", //MacPherson
      "position": { x: 233, y: 121 },  
      "style": {
        width: 28,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT27", //Ubi
      "position": { x: 260, y: 112 },  
      "style": {
        width: 12,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT28", //Kaki Bukit
      "position": { x: 270, y: 103 },  
      "style": {
        width: 18,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT29", //bedok north
      "position": { x: 262, y: 95},  
      "style": {
        width: 22,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT30", //bedok reservoir
      "position": { x: 292, y: 87},  
      "style": {
        width: 10,
        height: 10,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT31", //tampines west
      "position": { x: 308, y: 87},  
      "style": {
        width: 10,
        height: 10,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    //tampines covered in green line
    {
      "code": "DT33", //tampines east
      "position": { x: 340, y: 99},  
      "style": {
        width: 22,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT34", //upper changi
      "position": { x: 340, y: 108},  
      "style": {
        width: 22,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CG1DT35", //expo
      "position": { x: 335.5, y: 119},  
      "style": {
        width: 14,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "DT36", //Xilin
      "position": { x: 336, y: 130},  
      "style": {
        width: 12,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "CG2", //changi
      "position": { x: 352, y: 119},  
      "style": {
        width: 8,
        height: 5,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },

    {
      "code": "BP1", 
      "position": { x: 88, y: 35},  
      "style": {
        width: 12,
        height: 20,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },
    {
      "code": "BP2", 
      "position": { x: 71, y: 61},  
      "style": {
        width: 16,
        height: 30,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },

    {
      "code": "PG1", 
      "position": { x: 280, y: 43},  
      "style": {
        width: 20,
        height: 20,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },

    {
      "code": "PG2", 
      "position": { x: 260, y: 60},  
      "style": {
        width: 20,
        height: 20,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },

    {
      "code": "PG3", 
      "position": { x: 248, y: 12},  
      "style": {
        width: 20,
        height: 20,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    },

    {
      "code": "PG4", 
      "position": { x: 229, y: 33},  
      "style": {
        width: 20,
        height: 20,
        backgroundColor: '#333333',
        opacity: 0.1,
        borderRadius: 25,
      }
    }

  ];

  export default stationMarkers;