const onoFamily = {
    "name": "おの",
    "age": 32,
    "hobby": [
      "自転車",
      "camp",
      "サウナ"
    ],
    "family": {
      "father": {
        "name": "たかし",
        "age":65
      },
      "mother": {
        "name": "みちこ",
        "age": 24
      }
    }
  }

  console.log(onoFamily.name); // "おの"と表示されます
  console.log(onoFamily.age); // "32"と表示させましょう
  console.log(onoFamily.hobby[2]); // "サウナ"と表示させましょう
  console.log(onoFamily.family.mother.name); // "みちこ"と表示させましょう
