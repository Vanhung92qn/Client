var t = require,
  i = exports;
"use strict";
var n;
void 0;
Object.defineProperty(i, "__esModule", {
  value: true
});
i.TAG = "[SamLocRemake]:";
i.CARD_LIST_LENGTH = 13;
i.ROOM_DEFAULT_TEST = 32;
i.ROOM_TLDL_32 = 30;
i.WAITING_PROGRESS_BAR_SPEED = 20;
(function(t) {
  t[t.ERROR_MESSAGE = 1] = "ERROR_MESSAGE";
  t[t.USER_INFO = 100] = "USER_INFO";
  t[t.BROADCAST_MESSAGES = 101] = "BROADCAST_MESSAGES";
  t[t.VERIFY_PHONE_NUMBER = 103] = "VERIFY_PHONE_NUMBER";
  t[t.MESSAGES_AND_NEWS = 104] = "MESSAGES_AND_NEWS";
  t[t.PROMOTION_MESSAGE = 6] = "PROMOTION_MESSAGE";
  t[t.MESSAGE_INGAME = 7] = "MESSAGE_INGAME";
  t[t.FREE_GIFTCARD = 8] = "FREE_GIFTCARD";
  t[t.BROADCAST_MESSAGE = 10] = "BROADCAST_MESSAGE";
  t[t.SHOW_WEBVIEW = 12] = "SHOW_WEBVIEW";
  t[t.GET_TABLES = 300] = "GET_TABLES";
  t[t.FIND_PLAYERS_TO_INVITE = 303] = "FIND_PLAYERS_TO_INVITE";
  t[t.JOIN_TABLE_INVITATION = 305] = "JOIN_TABLE_INVITATION";
  t[t.QUICK_PLAY = 307] = "QUICK_PLAY";
  t[t.CREATE_TABLE = 308] = "CREATE_TABLE";
  t[t.REFRESH_MONEY = 310] = "REFRESH_MONEY";
  t[t.CREATE_TABLE_RESPONSE = 311] = "CREATE_TABLE_RESPONSE";
  t[t.QUICK_PLAY_WITH_BET = 313] = "QUICK_PLAY_WITH_BET";
  t[t.BOOK_ROOM = 315] = "BOOK_ROOM";
  t[t.CANCEL_BOOKING_ROOM = 316] = "CANCEL_BOOKING_ROOM";
  t[t.LOAN_MESSAGE = 322] = "LOAN_MESSAGE";
  t[t.GET_MAX_LOAN = 339] = "GET_MAX_LOAN";
  t[t.REFRESH_JARS = 335] = "REFRESH_JARS";
  t[t.INGAME_USER_READY = 5] = "INGAME_USER_READY";
  t[t.INGAME_USER_CHAT = 102] = "INGAME_USER_CHAT";
  t[t.INGAME_USER_LEAVE_AND_JOIN_TABLE = 200] = "INGAME_USER_LEAVE_AND_JOIN_TABLE";
  t[t.INGAME_JOIN_TABLE_INFOS = 202] = "INGAME_JOIN_TABLE_INFOS";
  t[t.INGAME_CHANGE_HOST = 203] = "INGAME_CHANGE_HOST";
  t[t.INGAME_SEND_READY_TO_COUNT_DOWN = 204] = "INGAME_SEND_READY_TO_COUNT_DOWN";
  t[t.INGAME_UPDATE_MONEY = 205] = "INGAME_UPDATE_MONEY";
})(i.GLOBALMESSAGE || (i.GLOBALMESSAGE = {}));
(function(t) {
  (function(t) {
    t[t.DEAL_CARDS = 250] = "DEAL_CARDS";
    t[t.DANH_BAI = 251] = "DANH_BAI";
    t[t.FINISH_GAME = 252] = "FINISH_GAME";
    t[t.SEND_DANH_BAI = 253] = "SEND_DANH_BAI";
    t[t.PASS = 254] = "PASS";
    t[t.CHANGE_ROOM_MASTER = 255] = "CHANGE_ROOM_MASTER";
    t[t.AN_CHAT = 256] = "AN_CHAT";
    t[t.PLAYER_READY = 257] = "PLAYER_READY";
  })(t.TLDL || (t.TLDL = {}));
  (function(t) {
    t[t.DEAL_CARDS = 700] = "DEAL_CARDS";
    t[t.FINISH_GAME = 701] = "FINISH_GAME";
    t[t.HUY_BAO_SAM = 702] = "HUY_BAO_SAM";
    t[t.DANH_BAI = 703] = "DANH_BAI";
    t[t.BAO_SAM = 704] = "BAO_SAM";
    t[t.SEND_DANH_BAI = 705] = "SEND_DANH_BAI";
    t[t.PASS = 706] = "PASS";
    t[t.CHANGE_ROOM_MASTER = 707] = "CHANGE_ROOM_MASTER";
  })(t.SAMLOC || (t.SAMLOC = {}));
})(i.COMMAND || (i.COMMAND = {}));
(function(t) {
  t[t.WAITING = 0] = "WAITING";
  t[t.PLAYING = 1] = "PLAYING";
  t[t.VIEWING = 2] = "VIEWING";
})(i.GAMESTATE || (i.GAMESTATE = {}));
(function(t) {
  t[t.JOIN = 1] = "JOIN";
  t[t.LEAVE = 2] = "LEAVE";
})(i.PLAYERSTATUS || (i.PLAYERSTATUS = {}));
(function(t) {
  t[t.DANH_BAI = 1] = "DANH_BAI";
  t[t.BO_LUOT = 2] = "BO_LUOT";
})(i.PLAYERSTATE || (i.PLAYERSTATE = {}));
(function(t) {
  t[t.PLAYER_1 = 1] = "PLAYER_1";
  t[t.PLAYER_2 = 2] = "PLAYER_2";
  t[t.PLAYER_3 = 3] = "PLAYER_3";
  t[t.PLAYER_4 = 4] = "PLAYER_4";
})(i.PLAYERPOSITION || (i.PLAYERPOSITION = {}));
(function(t) {
  t[t.WIN = 1] = "WIN";
  t[t.LOSE = 2] = "LOSE";
})(i.WINORLOSE || (i.WINORLOSE = {}));
(function(t) {
  t[t.TypeBIG = 0] = "TypeBIG";
  t[t.TypeMEDIUM = 1] = "TypeMEDIUM";
  t[t.TypeSMALL = 2] = "TypeSMALL";
  t[t.TypeHIDE = 3] = "TypeHIDE";
})(i.CardType || (i.CardType = {}));
(function(t) {
  t[t.NONE = -1] = "NONE";
  t[t.FOUR_OF_THREE = 1] = "FOUR_OF_THREE";
  t[t.FOUR_OF_TWO = 2] = "FOUR_OF_TWO";
  t[t.TWO_OF_FOURS = 3] = "TWO_OF_FOURS";
  t[t.SIX_PAIRS = 4] = "SIX_PAIRS";
  t[t.THREE_CONSECUTIVE_PAIRS_HAS_THREE_ACE = 5] = "THREE_CONSECUTIVE_PAIRS_HAS_THREE_ACE";
  t[t.FOUR_CONSECUTIVE_PAIRS_HAS_THREE_ACE = 6] = "FOUR_CONSECUTIVE_PAIRS_HAS_THREE_ACE";
  t[t.FIVE_CONSECUTIVE_PAIRS = 7] = "FIVE_CONSECUTIVE_PAIRS";
  t[t.SIX_CONSECUTIVE_PAIRS = 8] = "SIX_CONSECUTIVE_PAIRS";
  t[t.DONG_HOA = 9] = "DONG_HOA";
  t[t.DRAGON = 10] = "DRAGON";
  t[t.DONGHOA_DRAGON = 11] = "DONGHOA_DRAGON";
})(n = i.RANK || (i.RANK = {}));
(function(t) {
  t[t.NONE = -1] = "NONE";
  t[t.DONG_HOA = 1] = "DONG_HOA";
  t[t.TU_QUY_2 = 2] = "TU_QUY_2";
  t[t.BA_XAM = 3] = "BA_XAM";
  t[t.NAM_DOI = 4] = "NAM_DOI";
  t[t.SANH_RONG = 5] = "SANH_RONG";
  t[t.SANH_RONG_DONG_HOA = 6] = "SANH_RONG_DONG_HOA";
})(i.RANK_SAM || (i.RANK_SAM = {}));
i.RANK_TEXT = [];
i.RANK_TEXT[n.FOUR_OF_THREE] = "T\u1ee9 Qu\xfd 3";
i.RANK_TEXT[n.FOUR_OF_TWO] = "T\u1ee9 Qu\xfd 2";
i.RANK_TEXT[n.TWO_OF_FOURS] = "2 T\u1ee9 Qu\xfd";
i.RANK_TEXT[n.SIX_PAIRS] = "6 \u0110\xf4i";
i.RANK_TEXT[n.THREE_CONSECUTIVE_PAIRS_HAS_THREE_ACE] = "3 \u0110\xf4i Th\xf4ng\nc\xf3 3 B\xedch";
i.RANK_TEXT[n.FOUR_CONSECUTIVE_PAIRS_HAS_THREE_ACE] = "4 \u0110\xf4i Th\xf4ng c\xf3 3 B\xedch";
i.RANK_TEXT[n.FIVE_CONSECUTIVE_PAIRS] = "5 \u0110\xf4i Th\xf4ng";
i.RANK_TEXT[n.SIX_CONSECUTIVE_PAIRS] = "6 \u0110\xf4i Th\xf4ng";
i.RANK_TEXT[n.DONG_HOA] = "\u0110\u1ed3ng Hoa";
i.RANK_TEXT[n.DRAGON] = "S\u1ea3nh R\u1ed3ng";
i.RANK_TEXT[n.DONGHOA_DRAGON] = "S\u1ea3nh R\u1ed3ng\n\u0110\u1ed3ng Hoa";
(function(t) {
  t[t.HORIZATION = 1] = "HORIZATION";
  t[t.VERTICAL = 2] = "VERTICAL";
})(i.DIRECTION || (i.DIRECTION = {}));
(function(t) {
  t[t.SINGLE = 1] = "SINGLE";
  t[t.PAIRS = 2] = "PAIRS";
  t[t.THREE_OF_A_KIND = 3] = "THREE_OF_A_KIND";
  t[t.FOUR_OF_A_KIND = 4] = "FOUR_OF_A_KIND";
  t[t.THREE_PAIRS_STRAIGHT = 5] = "THREE_PAIRS_STRAIGHT";
  t[t.STRAIGHT = 6] = "STRAIGHT";
  t[t.FOUR_PAIRS_STRAGHT = 7] = "FOUR_PAIRS_STRAGHT";
})(i.CARD_TYPE || (i.CARD_TYPE = {}));
(function(t) {
  t[t.BOTTOM = 1] = "BOTTOM";
  t[t.MIDDLE = 2] = "MIDDLE";
  t[t.MIDDLE_TOP = 50] = "MIDDLE_TOP";
  t[t.MIDDLE_TOP_2 = 70] = "MIDDLE_TOP_2";
  t[t.TOP = 100] = "TOP";
  t[t.CHAT_BUBLES = 101] = "CHAT_BUBLES";
  t[t.BET_SLIDER = 102] = "BET_SLIDER";
  t[t.BET_BUTTONS = 103] = "BET_BUTTONS";
  t[t.CHAT_VIEW = 104] = "CHAT_VIEW";
})(i.GAMEZORDER || (i.GAMEZORDER = {}));
i.MYPOSES = {
  DEFAULT: new cc.Vec2(16, -243),
  LEFT: new cc.Vec2(-514, -243),
  OUT: new cc.Vec2(-432, -624)
};
i.INVITEBUTTONS = {
  PLAYER2: new cc.Vec2(548, 8),
  PLAYER3: new cc.Vec2(-19, 218),
  PLAYER4: new cc.Vec2(-679, 19)
};
i.POS1 = {
  index: 1,
  inPos: new cc.Vec2(0, 0),
  outPos: new cc.Vec2(-432, -624),
  cardPos: new cc.Vec2(-369, -271)
};
i.POS2 = {
  index: 2,
  inPos: new cc.Vec2(577, 25),
  outPos: new cc.Vec2(951, 416),
  cardPos: new cc.Vec2(451, 0)
};
i.POS3 = {
  index: 3,
  inPos: new cc.Vec2(3, 237),
  outPos: new cc.Vec2(-324, 514),
  cardPos: new cc.Vec2(123, 198)
};
i.POS4 = {
  index: 4,
  inPos: new cc.Vec2(-651, 34),
  outPos: new cc.Vec2(-1021, -167),
  cardPos: new cc.Vec2(-528, 0)
};
(function(t) {
  t[t.HOA = 0] = "HOA";
  t[t.BIBATSAM = 1] = "BIBATSAM";
  t[t.CONG = 2] = "CONG";
  t[t.DEN = 3] = "DEN";
  t[t.THOI = 4] = "THOI";
  t[t.ANSAM = 5] = "ANSAM";
  t[t.CHANSAM = 6] = "CHANSAM";
})(i.LOST_TYPE_RANK || (i.LOST_TYPE_RANK = {}));
void 0;
