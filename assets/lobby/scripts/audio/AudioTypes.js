/**
 * Created by Nofear on 6/8/2017.
 */
(function () {
    cc.AudioTypes = cc.Enum({
        BACKGROUND: 'BACKGROUND',
        NORMAL_WIN: 'NORMAL_WIN',
        BIG_WIN: ' BIG_WIN',
        GET_BONUS: 'GET_BONUS',
        SPIN: 'SPIN',
        STOP_SPIN_1: 'STOP_SPIN_1',
        STOP_SPIN_2: 'STOP_SPIN_2',
        STOP_SPIN_3: 'STOP_SPIN_3',
        STOP_SPIN_4: 'STOP_SPIN_4',
        STOP_SPIN_5: 'STOP_SPIN_5',

        BONUS_CLICK: 'BONUS_CLICK',
        BONUS_MISS: 'BONUS_MISS',
        BONUS_WIN: 'BONUS_WIN',

        OPEN_CARD: 'OPEN_CARD',

        MINI_GAME_ACTIVE: 'MINI_GAME_ACTIVE',

        X2_CLICK: 'X2_CLICK',
        X2_WIN: 'X2_WIN',

        EXPAND_WILD: 'EXPAND_WILD',

        EXPLODE: 'EXPLODE',
        SPIN_LOOP: 'SPIN_LOOP',

        //MONKEY
        MONKEY_READY_GO: 'MONKEY_READY_GO',
        MONKEY_BG: 'MONKEY_BG',

        //CARD
        CHIP_SELECT: 'CHIP_SELECT',
        CHIP_BET: 'CHIP_BET',
        HAND_WIN: 'HAND_WIN',
        DRAW_CARD: 'DRAW_CARD',

        //HOA PHUNG (116) - ten khop enum goc cua sunwin (AviatorSoundManager)
        PHX_BGM_BETTING: 'PHX_BGM_BETTING',       // aviator_bgm_1  - nhac cho + dat cuoc
        PHX_BGM_FLYING: 'PHX_BGM_FLYING',         // aviator_bgm_fly_1..6 - chon theo n%6, nap lazy
        PHX_SFX_BET: 'PHX_SFX_BET',               // aviator_sfx_01 - xac nhan dat cuoc
        PHX_SFX_IDLE: 'PHX_SFX_IDLE',             // aviator_sfx_02 - phuong dau tren nui
        PHX_SFX_TAKE_OFF: 'PHX_SFX_TAKE_OFF',     // aviator_sfx_03 - cat canh
        PHX_SFX_FLYING: 'PHX_SFX_FLYING',         // aviator_sfx_04 - canh dap (loop)
        PHX_SFX_HIT_STAR: 'PHX_SFX_HIT_STAR',     // aviator_sfx_05 - nhat duoc long vu
        PHX_SFX_METEOR_BYPASS: 'PHX_SFX_METEOR_BYPASS', // aviator_sfx_06 - thien thach luot qua
        PHX_SFX_TAKE_PROFIT: 'PHX_SFX_TAKE_PROFIT',     // aviator_sfx_07 - rut tien thang
        PHX_SFX_DIE: 'PHX_SFX_DIE',               // aviator_sfx_08 - trung thien thach
        PHX_SFX_JACKPOT: 'PHX_SFX_JACKPOT',       // aviator_sfx_09 - MINH no hu
        PHX_SFX_JACKPOT_OTHER: 'PHX_SFX_JACKPOT_OTHER', // aviator_sfx_10 - nguoi khac no hu
        PHX_SFX_EGG: 'PHX_SFX_EGG',               // aviator_sfx_egg - hoa trung sau khi chet
        PHX_SFX_CLICK: 'PHX_SFX_CLICK',           // aviator_sfx_click - bam nut
        PHX_SFX_WIND_UP: 'PHX_SFX_WIND_UP'        // aviator_sfx_wind_up - banh xe cuon so
    });

}).call(this);
