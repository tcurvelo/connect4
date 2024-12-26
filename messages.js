const messages = {
  "en-US": {
    BLUE_TIME: "Blue's turn",
    YELLOW_TIME: "Yellow's turn",
    BLUE_WON: "Blue won!",
    YELLOW_WON: "Yellow won!",
    DRAW: "Draw!",
  },
  "pt-BR": {
    BLUE_TIME: "É a vez do Azul",
    YELLOW_TIME: "É a vez do Amarelo",
    BLUE_WON: "Azul venceu!",
    YELLOW_WON: "Amarelo venceu!",
    DRAW: "Empate!",
  },
};

export class MessageHandler {
  constructor(lang) {
    for (let msg in messages["en-US"]) {
      this[msg] = messages[lang][msg] || messages["en-US"][msg];
    }
  }
}
