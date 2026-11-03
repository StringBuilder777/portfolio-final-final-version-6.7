// Source: /Users/stringbuilder/ascii/src/pieces/wired-intelligence.ts
// MIT, bas3line. User-supplied artwork; only the type import is adapted.
/*
 * wired intelligence: an engraved server cabinet, cables and circuit branches
 * on black, sampled from wired_intelligence_agency_home-3.png supplied by the
 * user. Fitted ASCII glyphs follow its edges on a 320 by 90 character grid.
 * Amber packets travel along the cables, server lights flicker, and network
 * nodes breathe. The engraving stays fixed so its fine detail remains legible.
 * No image is loaded at runtime; the drawing and colour map are embedded here.
 */
import type { Frame, Meta } from "ascii.rest";

export interface WiredIntelligenceOptions {
  [key: string]: unknown;
  /** Animation speed; 0 keeps the complete scene still. */
  speed: number;
}

export const meta = {
  name: "wired intelligence",
  category: "scenes",
  note: "an engraved server rack with amber signals flowing through its cables",
  cols: 320,
  rows: 90,
  cell: 2,
  fps: 15,
  ground: "#080706",
  loop: 12,
  options: { speed: 1 },
  palette: [
    "#191918", "#282826", "#383736", "#474644", "#565553", "#666562", "#757470", "#84837f",
    "#94938e", "#a3a19c", "#b2b0ab", "#c2c0ba", "#d1cfc9", "#e0ded7", "#f0eee6", "#fffcf5",
    "#3e220f", "#4b2e19", "#583a23", "#65462e", "#715338", "#7e5f42", "#8b6b4c", "#987756",
    "#a58361", "#b28f6b", "#bf9b75", "#cca77f", "#d8b489", "#e5c094", "#f2cc9e", "#ffd8a8",
    "#aeaeae", "#b4b4b3", "#b9b9b9", "#bfbebe", "#c4c4c3", "#c9c9c8", "#cfcecd", "#d4d4d2",
    "#dad9d7", "#dfdedc", "#e4e3e2", "#eae9e7", "#efeeec", "#f4f3f1", "#faf9f6", "#fffefc",
    "#bbb2ab", "#c0b6ae", "#c5bab2", "#c9beb6", "#cdc3b9", "#d2c7bd", "#d6cbc0", "#dbcfc4",
    "#e0d4c8", "#e4d8cb", "#e9dccf", "#ede0d2", "#f1e5d6", "#f6e9da", "#faeddd", "#fff1e1",
  ],
} satisfies Meta<WiredIntelligenceOptions>;

// Trim each row in source, restoring its exact width once when instantiated.
const ART = String.raw`
           '              '                        _,  ',    'B,   '(     ''i,  9,  (  (  3, 3;  (  |(     '                     ':   '; '              :||i@@22;;;: ''B@_    'B;                    '35|2BBBBB22@;|i9:'|B35|B:|||@5B@@@B2||_Ar5@B'''      \    s:   @(     |B'      ,    @     _/' )            /       /
           '              '               _,       '\   |      3&,  'S,     '(  '@ i  )   '(  ;  '( B         . '    '    :, : |  '   '' :             '||iBBBBBB@@;:   '9@,   3B                    '3;||B229B2|B;|B@''35B'@':||@B@BBBBBBB2|iM5        |  i   /    |B     |B   _,r'''   i'   _/'    ;          |      _(      _
           '              '                '(        ),  \      'B,   '(     5   3G' /     3  ;   |3'        ':    . '  .      '  :   '. '             ''|22BBBB@@B@G,    3B,  |@;                   '|B||3B|3B||3BihB;:32(|B':||B52BBBBBB2iM)'         | |'  |:    |;     i( |r'   :    B _,:'     |'         |'    _/'    __#'
           '              '                 '3_       ''.'\       9,    3(   3    ,S;      |,|(   2'         ''   '' :    ;  . :  .    . .              ''|||2225555BB@_   3B  |@(                   '|B;||B;3B|||B3:3;23B;3''|@9B|2BBB@@B@5;:'         |/'   i     |;     @ )'    |'   |(''        (         /'  _-''   _s#5'
           '              '                   '2s_,      '\5,      3,     ). i   |( 3.      B'  _/'                :    ' :    '  :      '                ''''''''' ' 2B@, |@:||@'                   ':3B||2B3B;|:3B''B'|B\B'iB'3B|2BBBB@B22:''          \    |, 3X '(     B|'    _(_-''3       ___(      __,=r'''___,AH5'
           '                                      ''=s-.____3.      9,      )2   2   '3(, ,(5  _(             :    :    . :    | ':   '. '  _|(B@@,__                  'BB iB |@B                   ':||B2222BB;|:'9@:2;:3@B@5'.35|B22B@B22|:'           '(    ( (   3,    3B    _X'    _iAXH55'5522'''''555;5r''''''
                                                            ''|;=s-_'B       |'.|(     '3X' ; 3\             ':    .   ': .    .  .    ._|;25||i253BBB@@__,             3B @( @B'                   '|||3B@222B2|;:BB@:3;:BB''':3BB|||@5BB:''             '\,  |;     9,   'B  i(   _i@M2    _-'    '''''''
     '          '      '                  -___         )9,     '(,  '3;,     ;  |(      |'3_(/    @;         ''   ';   '; '    |.''  ,;(5||i2553BBBB@2252BB@@@__       |@\@5_@B'                    ';||2BBBBBBB22|32B;|Bi5B;':|3B|||@5|3B,'                '\, ),    'B,   B|(   _@(' |( _-'            |h             ____,,__
     '                                       ''=s_       '\_     '\,  B,5_   B  |;2(,   ;  |S,    |,               '    :      '_,|X52|22GB5)||iG225BBBB@@@225BBB@@,___@BB\@B5|            ;        |'||22BBBBBBB293B2Bi3B;3;':|(B;||B::'BG                   '5.',    'B,  2;   iB'   3\''             /'         _,=(''
       '       ''  '                            '.'S_       '':.   '\_|; '5, h  '; @)( |: |(;3,_,  ;          '    :    ; '  _|X2||22592(;|=5|i|@222BB&225BBBB@@@222BBB@&2B5  |.          |'        ( ''||2B222BB@BBBBB@B3;5B::2|3B|@):' 3B,                     'i(,   'h_(|B _@'   _.B             ,/'         iH5--=---__
                                                    '2i@,       '.    )3   '((   ( (  32; B ;'B'\ |(  ___@@@@@@@@___    :_,s25|2XB22(;i||||;||23G2BBB@@222BB&225BBB@@@@222BBB@@__         /        |    '''3B||3BBBBBB@B@2BBB;35||B35:'   3B,                      ',\,  3(||B_B'   ;'i(   __,---=r''          iM''        ''::-
                                                     |BBB'        ),   32\, 'B   ||;   2Gi'|' 3; )(_@BM5''    '''3BBB(_|X5|iiBB22|i|5||;2|2:2|):5G22BBG2BBB@@@22BB&223BBB@@@2252BB@@,__   (       |:      '|B||3BB2BB@B@B5B23B5|||BB|:'    'B@                      | |  5 /|(B'  _( |B-:''              _B\ _2'
                              .                       '' ),        ',   B '( '\   (;    |B i  |;_|@B'         '   _|X52i2B555|iX5)|i252=||:;||||BB@@G2;5G2BBG2BBB@@@22BB&22BBBB@@@225BBB@@__,     /        'Bi'|B3B|@529BB@B3B222|BB;'    , '9B,                    |;';|B|'|B'  .(|.B)===::==-._      _/'  i(
                                                          '(  '5=., '(  |(  5,(\  '\     B.;  ||@B'),         _,=2||22555|i2(||i252(5)||2|2;|22|BBB9BBB@@@G225G22BBGBBBB@@22BB&225BBB@@@222BBB@&__'        |B':|B|G@5B|3BB9BBB222iBB;'  |(    'B@,                  |: 5i\(|@_-r'2.(2'           '':_,r'   @(          ,.
                                                 _         '(     ''._\  3,  3/,\  |;    32; _@B'   \   _,X;2('|iX525|i25||i252(52|i2X222|2;|2||BBB@i,_,'3BBB@@@@G2;522BBGBBBB@@@22H&223BBB@@@252BB(       iB':|BiB)|B|@B22B9BB@@2@B:' )'   ____2B@;@@@@&__      .. 2 |i(||B'  i('_X   _______,--::'''':-.9______,--:'''
                                                '5''s._ .   '\        '':,9,  32,\  ';   'G(_@B;    |i@M5''|i2925|iX5||i2i22|)|i|52555252|22|2i|BBh|93BBB@@&__'29BB@@@@@225G2BBBBBBB@@22BB&225BBB('       |@\::3@B@||BiB2i5@9B22B2@BB@@@@@MMB5'''''B@, ''2B@_;||||||;,3523B|-;|,|@5@B955''''''''55HA&___i(                    __
                                                      '3G_   'S,          '9,_ 32,3, '(   3|@B \  _@B5      '|;2(||)|iX|5|5|X25552222222(||2||||BB5B33X&23BBBBBB@@2__22BBB@@@@G25G22BBGBBB@@G22H|         @B:||@5|B|i5BBiB5B@B2@22@5i(,             3B;  :||B@;iB525i@&ABH55G25B55Hh&,__      ,/''' ''5BB&__              ,r''
                                        '       A(,  '9.,'5_   3,     5\,  '3G'h3,_2. '\,  3@( 3_@B'|          )2i2|)||2i52255552225||;|||'2||i|BB5B3332@BBB2552BB@BBBB@&,__23BBB@@@G2;5G2BBGB5,   ''s,, iBSi@B@i352@B3552BBB2@2BBB|:|5;|'| |;i' \;';'B@:|||2B@@BBBB2@@5A52@X5' _--:''''3S2;r'-_   _A('  '(29A&__      _-'
                                                  ').   '''|S_,___      ).   'B, '(''=s_5; @B|,|@5  ;      .  |()|5|i2222552222252i|(|i2:| 2|||2@B;55B9B2522922B525B@GB@@BB@B@@s,_22BBB@@@G22\2_;._:. 2S3B2iB5@BBB5@BBB2223BBBB2B@B;:' i2|: ' ' s2)2\|2BB|2@@B@BB@BBB25@5BB5__iiGAAAss,___/'5.__G#9_       ).  ''3HAA@i_______,s
                                             i,      ),      3,  ')(,     5,  '9; '5, '\'S2@(|iB5(  ;       :,  ;2||222252X2|)||;|2i|;2;|| 2||||B@52255G22223935225X2B2B2BBBGB&2BBGB@@s__2@52iB2BB@@22;@Bi@52@BX5@55GB@BB@5B5222|B2;:' '2(,   , |;5::(|3B@BBBB@BBBBBBBB2GBB5GGX=Xss--__,'''52'3G,   ':-_,    \          ''''''
                                              '':,    3,      3(    ''======H''''B2''hs_'.|@i_@5&2G,|        '\,552|22252|)|;2i)i|2i|i2;|i'5||||BB22@B2BBB&@2522225255B2B23BS2BB2B&22B25B.BBB2BBB9@s23B@MB@225@M5@25B3B@B2B252|2@5||:.  2(2.  '  '\;:|iB@BBBB@@BBBBBBB22&&AAAAAXh;,-:' ''hs,_''s2S,     ''':--2,.-i;          _-
                                 '                '.,  \       3(            ),   '9(,'\2:i@_3B2G325,(_        '222|,|)|i|i|;2;2;||i;|i;|| 5||;|@@2B3BSBBB@X52259G2252292GB&B2BB@2BB2B&2B2B552BBB9B2BMBB2_@@BBiBS2@5@BBB@BB@@@@@B222(|:.;;2|,,    |;2BBBBBB@BBB@BBBBB2i2''''''''' ''3hAs_   ')h._)2G           '(         _sr''
                                 .                   's_\       3;         ___i&AAAs29@_,|9@|@BG23255|G2G;::..  5|22B:|;2;2;|;|;|2|2;|2;|i'2||||@@2B3BBBBBBBBBBBBBX222BBB2@@3&BB52BB&2BBBGBBBXB|@@B2@&@MB255@B2i@@B3;|iM5@9BBB@S@@@2;||;|;2|B5;;|||22BBBBBB@BBBBBBB52)''                '2Bs_   ''hGB___         ).__-Ar''
                                                        '''\i,___2&---|iAH''__,.2s__'''3B@2@;B5i|5BG;9G52B;||;;:|||5B||:|i25|(|i2i22||2|:|'5||2|B@525@2BBBBBBBB2B2B5BB5B5B@BBB2BG@525G522B@@@@BBB2522@&@@@@MBB5B292i@B2|@B22@B259BBB@@BBBB;'|||222iBBB2BBBBB5222||:'''                    '(29,,     3('''''''''''').,
                                                 _,    _,-''      '5iH5  ir'      'S2':-._'BBBB2225B2BGBB5B@2||;;||5B|;||i|2|2;2;i2|2||2||'2||5|@@2B2X52BBBBGBB2BB5B2B2BB5B@@@&@252BBBBBB52222BBBBB&@@MS22|i@B2i@@B5;B|@BB@B2;_', '|BBBBB2||2252|i2BBBB222|||:'''''                        '( '3s,    3(             '':-.__,--:
                                                 ''''''          _@('5|_,      ______22___'3B3BG2B@;|2BBBBB@B@@;22|25|i|i2i2i252;2i5;2||||'2||i|@@55GBBBG&225BB52BBBBBB5B2B3BBBBBB@@BBBB59B@_52BBBB@@&@@@@BBMBB(Bi925@B2B5BBB@22;;,|'|'''||B@@@@BBBBB;2;35''''                              ',   3(    '&,
                                                                iB     ''555555''______,___5B@B;23&2BBB2BBBB@B@B|(i5B||i|;22|2i2|252X||;||'2|||;@@X@3B2BB@@G22BBB&@2299B2BBB2B2BBB5B9BB53;B;2BB@5&AGG2GG22BBB@BBBBBBB22X2525BBBBBBB@@_____,22|223BB2B52'                                     |    '&,   '9,              ,-:'':-
                          '                  --._,            _#'    |,----._,AH5'''     '''3B2B,229BBB@BB@BB@@B;||25|;(|i2|)|22i2||;)|;|||;||;|@@5B3B2222BBB2BBBBSS22BBB&@22G9&52BBG@@B3:BB22B2BBB@@__2552252@@@M53B223B@2B;'|''X ''39MMMBMMM5' |B'(     _-:                                 \     3,    2&_         ,:'
                            '                    ''_;s-.__   @5          _2r'''.,        _-.'3B3B2G2BBBBBBB@@@@B2;225|i2;i22i2i255252;2(|||5||2|@@552B3BBBBBB2BBBSB22BB5B2B@B2BSB@2225G(B BB|@BS@BB5GB2BBBBBB55(B522B59BB(.'.'/ |'     _.;):   _:2'    ,.'                                     )_    3;     3Bs_   _,(
                                            , __,/''     ''iH)s,_____sAH5'      ''=ss=r''     3B2B2BG2BBBBBBBBB5||225|i|;|5;||52||222(|2|||5||5|BB5@2GBBBB&@22BBBBBB5BB5B2BB@@@@@@G2BBG&&AMB52BBB9BGX55XB22X522;Bi92B ' :''''':_2  _ |||('     B5'  :''                                         '3;., 3,     3,'3BA2___________s
                                           ''''          _2'                     .:|||;::    _ 'B@BG'||2BBBBBBB55|25;|2|||2i|2|2|22552|5|||22|||BB2B|@&225BBXB2BBBB&2@B5B2BBBBBBB@@@BBBh3;BB22BBBBB552552X552HB2Bi9iB'..:'''.| 2  ,|2||'      ;|' '':                                             ). ''3;:::''32     '''''''''
                                       '              _,H'                      :|||222|;:    '''9B2B_''|||22BB55|22(||);|2|||25i|22;i|;;||2||;|BB52B92XG222BMB&G@25BBBB2BBBG&@BB9BB2BBB3;BB22B3BB2X55Xi52B|32@;B2B2B ,..::'':)'|||:;|:     |(  _;  ,|              _,-'                            '-_'B      '5_,
                                                   _sH5                        '||2BBBB@i@_       'B@2B_,'''|;:|2)|i;||;2|2|||22|i|522|2;||25|5|@B5B393BB2BBB2BB@@222BBMB&@225XB22BBBBBBB:BB52B9BBB52XB5X222X5B(B2B2B'  . .'|( ||;|||2   __,_,|_X'_|2'         _,-''                                   '|G._      2s._
                 .                          |@&AHH''                           '||2BBBBBBBBis___    '3BBB;|;'''||;||(i|;2|22||i22||25||2(||5||(|@B5B@95B2BBBBBBBBBBBBBBBBiB2522BB@&&222;B BB22B9BBBXB25X552X52B59i92B),,:::'| ||'|:|;( _iXi(' |22''''.    _,.''                                          3, ''-_     '''==sAA---
        '                                   '''                                ''||222525555X2M9BMMM@@&2;|35i,)|2;|ih|2|||22|||2|22252|5|||5||)|@B5229@&2222BBBBBBBBBB2BB2@@@@@@@@2BBB@52.BB22BB@BB55XB55AX52XB23|B2B__'''.';|:|;||||;2'_2(   ',;   |'-:''                                               'B     '\,
                          '                                                     '''''''''             ''52(222@@X;;i;2;|(|22|i|2||22;2i2||||2|||@BG2|25BBBBBBBBBBG2222BBB2BBBBBBBB@@BBBBB;BB52B3BBGBB5G9BB5GX55232B2B '3h_,|||||;||23;  '''_,=(  . ___                                                    3@      '\
                 .                                                                                      '.@5iG3Bi@25;|||2|52|2i22|i25;22|||52|;|@B55@B22BBMMB&22225BX522BBBBGBBB2BBB2BBB2;BB25B9BBBG2X|5GXB52XB53i25B   '' '|'|||:||3(  |5|2'     _25X           . .  . .  . .. .  . . .. . .. .    .. . ..9&    .  ),
                 '          '                                                                            ')|B5)|@5B2(|||;|5||i25i|222222|i||||i|@BBB3B9BBBBBBB@@2222BBMB&&222559522BBBB22;BB25B@BBBB222XB22XB2GX32B2B': .':||||2|||@B_||2|(      i|3(;                                                     'B;,      B
                            '                                                                             ''\|@BB225B_||2|2i|ii|||2222|2|||22||i@B5B3B9BBBBBB2BB2BBBBBBBBiBBBBBBB@@@&22;B:BB2BBBBBB52XB552B52GB532B5B||..|,(;||i@@B2||i5i(    ,-2B('''             '         '       ' '  ' '               'B,\_             '
                                                           ' '' ' '' ' '''' '  ' ' '' ' '' '    '           ''|222BB,3B22222|i22|i25252;|i||5|;iBB555@225BB222BBBBBBB2BBBiB@@@@G2B9B52B53,BB22BB@BB3BBBB@@55BB5235B2B||2|XX:|iB2||||||252:_sX'''      '      ''    ' '' . ''    ' :''.  ' ' :' . '' .  '    ''B,'''=-__; '
                                                 .. .  . . .. . .  . :  . .  . . .  . .              '''''::-._|2i2BB;(9@222|2|i222222i;|||2i|(iBB2B9BB552BBBBB&GB222BBBBi@BBB9BBBBB2B2BB2BB52BBBBBBB5GXB253BBBB32B5B||32555|2222|22'22B5' __,__      .    .  ,__,.--..    . .. .  . . ..      .  . .  . .    .3;,     '''\,  .
                                                                                                    ---.,____  |||23BB222Bi2|X22|2222;22|2||2|)i@BB52BBBMMB&&222255X922BBBBBG2222;iB22G2BS92G5B@BBBBB2B5BXBB55BB3B22B|||X2i|2225B@@5:252''''' '   ':'.:::'''''                                                  '9_,
                                                    '    '   '' ' ''      '    '      '    '                '''|2i5iBBB553B5||2i||2222i2||||2||iBB5@9B5BBBBB@@XG2225BBMMB&&22255BXG22@2B,;B29Bi3@BBB52BBB55GBBBB3BB2Bi@@BB;'22B@@BB(|2||___  __,2=s._.                          ' '               '               '9&_
                                                                '  : : :: : :  : .  :      :                   |2|2iB2B22|@|252252225222|2||2()iBB2B3BSBB2BBBBBBBB5BBBBBBiBBBB2BBBBB@BB;B)@B23&BBBB522BBB52X225B3B52B|BB@B@B3BBBB5532BB'' ''' '  _ :  '  :    ' :  ' ': :  ' :: ' '''. '' ' '' .  '    '    '        '3s__
                                                                                       ________________________|2|;@B2Bi)iBi||2222222525|||5522i@B25B@5BB222BBB5BS5B2BBBB2@@@@@@@@@22BBBB;BBB@3BBBBBBB2GBBB252BBiB2;B|B@@@@5;BB25||X5( .'     ,'''( '._______________________                                            '''9B
                                                                                       ''''''''''''''''        ||2iB;@B|@B2||222i5225522|2|;5|23BB2@XBBB@@BB&&G@2555BBBBB2BBBBBBBBBBBBB53(B@@B39@BBBBG2@@B522BBB3B5;BiB@@@B|222|)'    '=hs;9925:.  ' '
                                                                         '. ' '' : '' . ''                  ___|2iB5@@BB5|22||2225i255i5|||;2||i@B2('''''''555XXXBB22BBBBBBBG&B@@@BB5BBBB2BBB99iBBBBGGBB@5B5GGBBiBB2BiBBB52i,;2|''' ..'.  '5X('  '', .
                                                           .  . _  , .  , _ .. _ .  . _    .         .  _@@MB5'||B)|3@|55|3i|5252i225525|||||||i@B;5:|::|;|;..,::.   ''''''''559XX2@5222BSB5i2BB@BBB55GGB2B222GB3B22B|2|55|;''|;.,      '     '''hB(|:                                                    '''''''''''
                                                                                                      |@B'   _,iB2;|@5|22222|i2223222222||||2;|i@B5B)(;(2X/|;|-i,___:'..' __.--._@5|i@BBM5SB@BB@@BB2BXB552GXB95BiBB2B'2;9.,;;)|''':-.,        '''@BX2;'''::---.                                            '''''''''        '
                                                           ' '' ' '' ' '' ' '''' '''' ' '' ' '' ':|;|@( ' ''' iB2|(@B|;22|222i223i2222i5||||522i@B5B23;|223G5i;)32S5G;i;3|._|_AS25GBH52@B@@B22BB@BBB52522BBB552BiB2BB:|'X)2''.  '|,  '   |, ' '  '''''                                '                     ''''''
                                            .. . .... ....   .. . ..    . . .. . .. . .       .||||@B5;:'    iB|223B22225|225i5222|52222||||(22i@B2B2B2&22(B22;2;B|32&;B5||@5AH52i@BB553@'3B|29B@BBBB2GB2222BBBBiB52B|B2'|''','., '.'':-|,'-, '   =:  --___                        ''''''''''''''''''''
                                                                                              '||3BBBB;;-:''|@'|5\B522222|55522222|52522||||;|2i@B5B|9;)5B|23)3,3B:5|B2(23\@\@BiBB). |232.3B|i3B@BBBBB52GGBBBBBBiB253''',._,:''.)=-,    ''9G.'s,   ''-     '''::-.__           '' ''''''''''''''''''''''                 '''''''
                                                           '    ' '' '    ' '       ' ' ''   ''||3BBBB2;:   @B |2@Bi2i225|225|2222|22222|||2;25i@B5B&&2s222____5GiB|i2||2iG\B2@'2';''i53B:3Bi23B@BB555GABBBB22BBiB523;||;;' .    '. ''.':   '. '2h;r:;              '                                                  '
                                                             .: . .: . .. : :. : .. : .  . : ..'||2B25|::,'|@( |i@X3;2|22|22|22222|222i2||;|2|;i@B2BBBBBMMM@@@BB&&&@@@@@@@@@BGGG&-G|___3B:3Bi23B@BBG2XB5255GBBBB|B223;)|'|:;,.     |   '.|., 3;  __:|,                              ''''''''''''''      ':           '
                                                                                                ''|2|||;;  |@  |3B2352|225i2|2|i22i25222|||22;|i@B5;BBBBBBBBBBS@@@@22G5252BBBBBBBBBBBB@B9;3B|23B@BBB22522XBBBB2B|BBB3;=(|25)'',    '\,  |.  )|9_2 '''                                                     '        '
                                                      '                                          |(;''()'  |B_.|35;3;2|i2222|||2i2i222|||||2|||i@B5BBBBBBB22BBBBBBBBBBBSB5@@&@&2@@22@2@B2;3B|23BBBBGBBBBBBB5222B|B2B3;' :3:'' ),     ),,'  '.,)2B( , :                                                      .    '
                                                                                                 ( ' 'i;|,-'B; '9;;3|||52222|i52i2|25222|||||||iBBBBBBBBBB22BSBBBBBBBB5B22@BBB@@@B@B32BBBB3B|29B@BB22229BBBBBBBB|B523;:')'':'3'i. .   '|,    3; 2B '|,-_                                                  . .               ''''
                                                                          '                  ;  (:|__)'|(|. 3B :;|;9||||52222i22|i|222i2||||2||i@BG22BBBBBBBGGGBBBBBBBB222B2BBBBBBBB3BBB5B3B|23B@BBGXBBBB522GGBB|BBB35;;, '''3,2,: '|,|_2;,   |;.|; |.  '':._                :................       ''     .            .
                        .............                                        . '      .': '  | : ''|( : |:  |B&|;2;B|||22|222ii2i2|25225||5|2;)3@B52222222222222222525999999999G22BB25223;3B|23BBBB222GGBBBBBBBB|BB23;||2|::,'3(3,  3;|; )3;  |; 3h,|'       ''-_,                                          .        '
                                                                            '. : ; '  :': :  '/   ;'; . '  ||'B|;|;B22||5|25||2222|22(|5||225;)3@B(2B9BBBB222B2B32222B3BBBB2B2BBBBM@@@@hB;3B|23B@BBGBXBBBBB2555B;B5B3B@2i|;52X;|,3.  | ',\_;_,|2_'3;             '':.,           ''''''''''''        '
''''''                                                                       ' ' ' | ' '' .. |'  .;________ :  |;|;B;|||525522|522225252||2||;|3BB2BBBBBBG2BBB32BBB252BBG@&2G22BBBG2B@@B@;3B|53B@BBBBBB5BB552222;B223B@@@@25522;|||;,|;.'|2225X5|9B'|___,,___                                 '
                      '   '   '                                              : ' ' '.,.': .  |_@@MM5555'25BB@@,|;|;B|i|i2i222252|2|;2;i5||||2||3BB2BB5B2BB22222222|2BB2552B@B22B@;252B@5@23B|23BBBBBB222B2223GGB;B2B3B@@@@@@52222;):||||;|52'25||2G525'5'''3BB@_,
                    '                                                       '' ; : ' ..': |_@B5'' ; : :   |  ''|;|;B||||2||22i|||22525|5|||||;|iBB2BBB2BBB5222222B@@5|2B2B;GB@&55B222B2BB23B|23BBBB222522222XBBB;B923B252BBBBBBB@@@22,|;;:||,|)'2i2;9@,       '3B@,''            : ......... ..      '
                  '                                                         '. ' ' ' ' '_iB5||  | ; ' :   '    |;||B||||2|(X||i222|222i2||||2||3@B5223B@BBBBB292BBBG3&2SB@BBB2BB2B2&5BBBi9BB|X3BBBB22522222BBBBB;B993(|h|2 '''|22BBBB5i5;||i2@|@5|B52B\,         3B@:
                          ''''''''''''''''''''                              ': ' ; ' '_|B5 ,';  | : : '   |    ;)|(B|)||;|||;2|2|||22|2||||||:;3@B22522222_______|_|2B2&29@9@2BBB|_2B2@B32|B@23BBBBBBBBBBBBBBBBB;B3B3;B'|\ ' |';X/'|3,'''|i;3@@@B3(|;. ''.    _  |'35i,:..                               '          '      ... .
                        '                                                   ':   : ',|22'  : |,  :. ' :   .    |252B|||i5||||||||2|25222||||2;|3@B2@BBB@@BB@B@@@@@BB@@BBB53@B22BBB923B@B323B9@3BBBB2222222255522;B5B3B' |;:' ( 5') '2;   _''9B55('  ;.      . |. : |522@;;:'                                   '
                      '                                                     ':   ,  )2'' ' ;  |  |; : :   |  ' (|:;B|)):(:|2X525i2|55222|||||;|3BB(iB223BB3B@@BBB2BBB2BG2B2B2BB2BB@BBBB2@23B|B@BBBBBXXBBBXGX2G2B;B22iB :|(-- ''i;:|2X(   |,|;  |(\  'h .    . '.'::|iBBBB2;;:                                    '
                                                                             '   :    ''   (   \ ': . .   |    |||;B||:|5||(||;||i|252|2|||||;|iBB2@B3B3G222522BBB@;;2B@2B52BBGBBBB|23B@22i@||B2BBBBBBB9BXBBBBBB(B3B3B()(  .   |5(3' '|; ' |; ;|;2;  ' .   '' ''';'|2BBBBBB|::.''''''''
.....      .  .....                                                          .   :         :    ),:,, :   |  _.|;|;B||||2||))|==2||22||2||;||||3BB2BBB@@@@SX93AGBB5B3B3@29BGB32B3BB995@|B/|B|i3BBBB222222225BBBB(B32iB5' , i;   ' B |:i; ;'|; ;;3|,   ': :  ' | ';'|22BBBBB5:'                      '
..................                                                          '    '         '    '|||;.;   -_/' |||;B||:|2:):__2(|5;252|2|||||||3BB2BB2B32B52222BBB&3B3BBB@BB3B@33B@iBBB2BB3@|2;B3B9BXGG22222i522;B293B; |' 5)     B,' iB-B|i' :|,|X ; -. .  . :  :'|:|2552|:''                '     ' ''
................         .                                                   .   |         ;     ||9B(;. _2'.  5|||5|||||2X|25'|;|;i|i===:|||;;3BB55B5B92B|252G559&53B225@333B32@5@||_@2B9BB|ii3BB22|;i@@2&&&&@@@B2B3B  |,|3(   _2i''''B,i;) | ''i(,|: : '  . ' '' '''''''''               '
                  '. '                                                       '   :         .     '''25;|/'5'''.||;||2||@22@5'||i555222|2(22|2)|3BB(B5ii@@@AG2X2B9X2B3BBB5BiB9B2GB;@2B;@|;BBB|B3BB3B2222222222BB@@@B23B  ' '_;   ( | ,  3@;s( '|  |2)|h'' ' '' :  ' :                          '            ''    '    .       '
                    '  '                                                    ';   |         :     |  ''(:.'|.'  ||||2|@B|(@2;||2222222||2;|2||||3BB22BBBBBGG2GG&2BB@2XB32@3B@3BB9BBB@BBB@B2BBX23B9BB9BBB222222222GGGGGGs(, '':       '  -BG'  .'..'':.)'. :. : . .. '                          '     '                 .     '
                      '   ''''''''''''                                       '   .         :     .. '''::||,.,||;;;iB5|2@(:=352X5||2i2|52|2|2||3BBBBB@@@@BBBBBBB33BBiBBBB55B3B|BBBB3G@BMMBB3B2B23B2222GGGGAB@@@@@@BBB2222;              3B     '    ..'. ;' . |    '   '||_;.                 '     '              '  .
                        '                                                    .   '        ':     ';:|;;|iX2.::-ii.@B||23B|22552===hhh;=isiii2GGi&&&&BB@@@@@BBBBBBBBB3B9@52@5@33B23B33B@BBB2BBB3@@B@@@@@BBBBBBBBBBBBBBBBBB3&__           2B;         | '|;;.|. :    _  '||BBB;:                '        '           '  .      '
                         ''                                                  :            ''     ''iBBX|9B2:||;.(@5|X\5B(|||222|5||XXXXXXii2ii2i@&&BBBB@@@BBBBBB5BG2@55B2|B|B33BB@B\@2BBB@B9@BBB@BBB@@@BBBBBBBBBBBBBB2BB22 ''3H&__    .|i2;,.  :    : '|BB;|: :       '||BB5:'                           '            .      '
                             '   '                                          ''             ;     '''''''''|:|)||@(;|2i;B(2|||22i522||2||2;|;:|;3@@BBBBBBBBBB@@@BB2G5B2@BB3B3B23B2B2@5B2B@BBBBB2B3BBBB@@@BBBBBBBBBBB2B@G&&@,,     '9_,:|BB3B;;::|    ; ''|2)|;'|      .'''|:':                                         .      '
                               '         '                                                 ;     '        '.||iB(522|X|B||||||532;2||2||2;|;||;iBBBBBBBBB@B@@@@BBB2@BB3@|@2@B3BBB33B2G5BBBBB3BB;B2B2B3@@@@@BBBBBB55522222&&AAA._   '3@;2BBBB|:::    '   '''): :     '    |'  :                                        . .    '
                             '                                                             .     ..      ,i,;3B_;||22(iB||||||;i5|25||||2||;|||iBBBBBBBBBBB@@@BBBB2BBBBB2B;@2;B3BG@392B5BBBBXBB3G9G22B2G@@@@#MBBBBB5222@@@@BBBBB    '3BBBBB2|::|    .      '.). ..     .'''.  '                                       . .    '
                                                                                           .     .    _|,__|@5|)||22523GXXsisi|i||2|||;||:|::||3BBBBBBBBBBBBB&&@@@hB3;BB3B2B2B2BB3BiB|2&22B@MBBGBB2B2G9B@@@@BB@@BBBBBBBB9B55''''   _@B52BBB|:'''    .    . '';;:'::..'     ''.:|;||;:.'.             '                . .    '
                                                                                          ':     ';||i|||25B)3XXX595i|B|i2||||;|)55522225BBBBB;@@@BBBBBBBBBBBB22223B23BB3B@B2BB2(@BB3@22B222B2&5BGBB2B@S9B&B555''''          ___@@B5''''''''' ':    :   .;;|;|i2;;:   '''-._'|||2@B@2;: '            '   '            .      '
                                                                                    ___,issss,___ ';:2;_@B5.||_A55|;|@\225552259BBBX@@Bi2G2222|222@@@@@@@BBBBBBBB2@5iBiB3B9BB3BB;BBGB2B2B29@B29BG_2B@&_2B@G2BB@@@@AAAAs-sX@@BBBBG,,            .    .  :i@@;|3BBB;::........|||BBBBBBX::             '             '  .      '
                                                                                _i@M55''''','''''55|i@B52GAAH55)::|@B);22|||22|52|5||:22|222552BB22B@@@@B@@@BBBBB3B5B2@53B9B2B55'BB59GB@_).'3H&_ '25MMBGBBX|2&@@@@BMB559BMM@@__   ''           .    '  '3BB)||252:;         '||9BBBBB5:'             '             '  .      '
''''''''''''''''''''''''''''''''''''''                             ____iAAhXX|@B5)=XAAXX@@@@@@@@H955'            iB'  '''''''='XX|2;i;|;|(:|:;3BBBBBBB@@BBBBBBB55B3('3B |B3BB2B_ 3B3BG2BGBB@@,__2@@_,@@@@BBB&&A@@@@@@@@@@&,___3B@_            ':    :   '''''':|''''.        |2|2BBB5;:              '             '  .      '
                                                             __s@MB25'''   _@5'            '                   iB5                    ''''''''395''''''        |@5' iB  'BB'3B2B@2B, '5@_,39HBGGGGGBBBMB55'52'''        ''''59BB@G2;           .    .         ; .    ':,_,  /''')':''''.             '             '  .
                                                       __@@95''         _@B'              ':                 |@5   _____________                           _,i@B' _@B   |3B  3B,'55B|,  '5B@&2______  '3&___9;__                 '3BB@_,      ''    '         ' :      |BB:'   )  :.    '. .         '
                                  '  '             _i@B''             _@B'                ''           _____,2_@@MB525''''''''35BMM@@&____    ________&@@MB|i@5  i@5    i(B;  3B,  9B9@&__  '''525535555'52GG525BBBBMHA&___        |BG3B@_,    '              ' '      ,''.   )  'i@:    ''||_;::    '   '
                                               __@B5'              _@B5                    '  __,@@HB95'''_@BB''''''5H&_, ___,sAAAA@XB253BBMMGG222222____@@M5__@B5    _@5 'B,  3B   9&''5BB@@_  ')(_      3BB'3&,        '29H&__    |B; '5B&,  .                |    ,'   '..|' .''''    '|iBBB;:    '
                                             ,@B''             __AM2'                    __sH55'       _@B5|@.      __sBMBGBBH555''''555X#H@@&,__22222522&@@MM5'     iB'   'B; |B;   3&,   ''5B@_  '2HH&__ 3B; '3@_,          '29&_, 9B    3B&,               '.|;;,:    _;iBB:'         |:|3B5:'    '   '
                                           __'__           _,A92''                   __@B5'          _@B(  i@   _|@B52X5''@,                 '''''555555''        _i@5      '9@|B(    '9@,     '9@;      '2SBB   ''3M@@__,        '3@3@;    '5B@              '|BBB;;:''  ''|:'       .    ''''      '   '
`;
const INK = `
000000000009000000000000009000000000000000000000000EC00DD0000EFF000DE00000BDFB00EC00D00D00EB0FD00D00EE00000A000000000000000000000AA000AB0A00000000000000QRRUUUVVTRRQ0CEFFF0000EFF000000000000000000009FSRTFTTUFSRFRQEFDPEFFFEFPQRTFUUVVFFUSSEEEFFFFPP000000C0000ED000FF00000EFE000000A0000E00000DDD0C000000000000B0000000C000000
000000000009000000000000009000000000000000BE0000000EE000C000000FEC00CEE00000EE00DF0D00D000BE00D00CC0F000000000A0A0000A0000AB0A0A00B000AA0A0000000000000PQRTUUUUVVFFUQ000CFFE000FF000000000000000000009FTRSFTSFFSRFCSEFPPFFE9FCPQRFFVFVUUUUUURFFF00000000C00D000D0000CF00000DF000DEEEBB000FD000DDD0000B0000000000B000000CC000000F
0000000000090000000000000090000000000000000DE00000000DB00D000000DEE000DE00000D000EFC0D00000D00E000CED00000000AA0000A0A00B000000A00A000BA0A0000000000000PQRSTUUUUFFFEDD0000FFF00DFE00000000000000000009DFQRFERFERQFFEEFBAFDEEFPPRDFFTUVUUUTSFFFP000000000D0CC00DC0000DD00000FE0DDE000B0000F0CEDD00000DB000000000CC0000DDD0000CFFF
00000000000900000000000000900000000000000000CEE0000000BBCBD0000000FF0000EE000E0000EEC000000CBEE000EE0000000009A000AA0A0000A00A0A00B0000B0A00000000000000PQRRSSTUUFFEEEFF000FF00BFE00000000000000000009CFSQREUFEQQCFFSEFDFFDFDPEEFFRSTFFVVVFFQQP000000000DDD000E00000DC00000F0DE0000BC000EFCD00000000C000000000CC00CCDD000FFFFE00
0000000000090000000000000090000000000000000000CEEEC000000CCEC000000FF00000EE0E000DD0ED000000EE00CED0000000000000000A0000A0A0000A00A000000A0000000000000000PQQQQQQQP0A0FFFB0DFBDEFD000000000000000000GPQDFRRUFEFRQQFFQBFCDFDE9FEDFERSEVVVFFSRQQP0000000000D0000DB0ED0BD00000FCC0000CCCCCCF0000000BBDD000000BEEDDDDCCEFEFEFE000000
00000000000900000000000000000000000000000000000000EDEDEDDEECED000000FD000000ED000D000CDEB0CCE00EF0000000000000A0000B0000A0A0000B0AA000AA0A00BDDFFFFFD000000000000000000CFF0FF0DFF0000000000000000000PQQSFFSSUEFRRQRFFQEE9FFFFEPPFEUESSUFFTRRQP00000000000DE0000D0C000EE0000FF0000DDE0000FFEDEEEFFFFFFFEDDEEECDDDDEEEC00000000000
000000000000000000000000000000000000000000000000000000000000CDDDDDEDCF0000000BCCCD00000CFEC0D0EE0000000000000AA0000A000AA0A0000A00B0000BCBCCCCDEDEFFFFFFFFB0000000000000FF0FF0FFC0000000000000000000PSRREFVTTTFTRRQFFFREDAFFDPPQFFERRRFFFFQQP0000000000000DEB00CE00000EE000CF00DD000DFFFF0000CBB0000BDCCBBC000000000000000000000
000009000000000090000009000000000000000000CDDB000000000EED00000CDC00CFFC00000D00DD000000BCEEDC0000ED000000000AA000AB000AB0B0000BAAA00CCCCBCCCDCFEEEEEDDFFFFFFFFE0000000CFEFFDFFD00000000000000000000PSQRSEFVTTFFSSRFDFFSEFDFRPPQEFRQQFFREFRP0000000000000000DCC0DC0000BFD000EDD000EFED0DF0CCC000000000000EE0000000000000DEFEEDEE
000009000000000000000000000000000000000000000DEEDC0000000CCC00000CCC00FCDC000F00CCDDB000C00EED0000CC000000000000000A0000B000000ABCCCCDCCDDDDCBBDEFEEEEEFFFFEDFFFFFFFFDCFFEEFFFC000000000000C00000000SRQRSUUUTTTFFTUEUDFSFFRFFPPTDFDQFFQQCFF0000000000000000000DDDCD0000CEB00ED000FFC000ECBC0000000000000CD000000000EEEEEE0000000
000000090000000990090000000000000000000000000000AADED0000000CBCB000DDCEF0CDE0F00CD0EDD0BB0FDCEDCB00D000000000090000A0000B0A00CCCCCCCDDDDDCCCCCCCDEEFFFFFFEFFFFFFFEDFFFFFFFFF00CA0000000000CB0000000GS0PQRRSFUSSFFFVUEUEFFEDEFQQERFFRFSQPGEFF000000000000000000000CDEB000DECDDE0CFE000CCE0000000000000BCC000000000FEFDDBCDCCB0000
0000000000000000000000000000000000000000000000000000BEUUUG000000BB0000DE000EEE000C0E00DED0E0DBEBC0DC00DEFFFFFFFFFFED0000ABCCCCDDDDDDCCCCCCBCBCCDFEFEEEEEEFFFFFFFFFFFFFFEEFFFFFFFE000000000C00000000C0000PQQEFRRFEFUTFFFFETEDFSETRDFFFQPG00DFF0000000000000000000000CDCB00DCDCFDEE000DCFE000CDCCDCBDCD0000000000FFDC00000000CDDBC
00000000000000000000000000000000000000000000000000000SUUUP00000000BC000FFCC0DF000DBB000EEECEB0ED0DDEFFFFFD0000BDFFFFFECCCCCDDDDDCCCCDCCCCCCCCCBBDDEFEEFEFEEEEEEFFFFFFFFFFFFFEDFFFFFFFFD000D0000000CC0000009BFQREFFUTFFFFETETFEURRRFERQP0000DFF0000000000000000000000E0C00D0DCEED00DD0EFCDDD00000000000000EFE0EFE0000000000000000
000000000000000000000000000000900000000000000000000000QQ0DD00000000CC000F0DD0CE000CC0000EE0E00DECFFFE0000000009000CCCCCCDDDDCDDDDDCCCDCDCCCCBCBBEEEDEEEDDEFFEFFFFFFFFFEFFFFFFFFFFFEDFFFFFFFFB00000C00000000AFTSDFEETFFUFFTFUFFSRRRFFQP0000B0DFFF00000000000000000000DBACCEDCDFD00BDCCFCCDDDCDCDCD000000DDE00FE000000000000000000
0000000000000000000000000000000000000000000000000000000000DD00BDCDC0CC00EE00EEDC00CD00000EBD00CEFFCCB000000000CCCCCDDDDDDCDDDCCCCCCDDCBCCBCBBCCCFEEFFFFFFEEEEDDEFFFFFFFFFFFFFFFEFFFFFFFFEDFFFFFFFEC00000000AFRPCFSFFFFRFFUEFEFUSRTFFQP00RC0000DFFF000000000000000000EB0DEFDEFDDDCDCDEC00000000000DBBDDDD000EF0000000000CB0000000
0000000000000000000000000000000000000000000000000D000000000DE00000CBCCB00EE00DDDD00DD0000EDE0CFFE000C000FFEDDCCDDDDDCDDDDDCCDDDCCBCCCCCCCBCCBCBBFEEEEEEDFFFFFFFFFEEEDEFEFFFFFEFFEFFFFEFFFFFFFFEEFFEE0000000EFPPCFFFTRFRFETUFFFVVVUFFQPGSS000CDEEEFFFDEEEFFD0000GGPPGE0CEFEFFE00EEBEE000CEFEFEDDDDCDDCCCDCCEDDDCCCBCCCBCC00000000
000000000000000000000000000000000000000000000000CEDEEEE09000DE00000000CBBBEE00DECD00CC000CEDCFFC0000DFFFFFDCDDDDCCDDCCCCCCDCCCCDCCCCCCCCCBCCBCCBEEEEFEEEEEEFEEEFFFFFFFFFEEEDFFFEFFFFFEEFEFFEFFFFFEB0000000CFDPQDFFEQRFFFSUUFFFSSUUFEFFFFFFFFFFEEDCEFFE0CDFFFFQQRRRSTSUEEDEFBDDDCEEEEEEFEEDDDEEEFFEFFFFEBDD00000000000000000000CC
000000000000000000000000000000000000000000000000000000EEEE000CEC0000000000CFFD0DECDD0CD000ECFF0D00FFFF000000CCCCCDBBDCCDDCCCCDDCCCCCCDCCCBCCBBBBFEDEFFDFEEEEFFFEEEFFEFFFFFFFFFEEEDEFFFFFFEEEEFEFC000000000FFQSFFFDFRCFFEUUTFFURUTSFTTSQ0000000000000FFF0GQQTFFUUUUTTVFFFEFEEFFEEEEEEFEEC000000DCCCB0ACFFFFFE00000000000000EEDD00
000000000000000000000000000000000000000090000000EED00CDCCEDD000ED00000EBB00BFFEEEEEED0BDC00EFE0DDFFFD0000000000CDCDCDBCCCCCCCCDDCCCCCCBBBBADBCBBFEDEFEEEFFFFEDEFFFFFFFEEFEDEFFFFFFFFEDEDEFEFFEFD000BCEEE0FFDSFFFDFETFFEETTTFFTUTUUFRQSTTCAB0CDDC0CCBCDFFRRRSTFFUVVVVVFFEEEFEDEE0CCCCCCCEEEEDDDCD000FEDC00CDFFFFFD000000CCD000000
00000000000000000000000000000000000000000000000000DDE000CBBEEDACDD000000DD000DED0DEDEDDDCD0FFCCFFF00C000000A00CCCCCBCCCCCCCCCCCCCCCCBBCCBC0CBBBBFFDEEEEEDEDEEFEEEEFFFEFFFEFFFFFFDEFFFFFFFFEDDCFFCABBA0EDFFCFFFFFEFFFFEFTSSDFFUTSUFFSQPGTTSS0B0B0DDEESRDFFSTUUVFFVVVUFEFEFFFEEEEEEFFFEEEFECCDDDCEEEFE0000000CC00DFEFFFFFFEDEEEFFF
000000000000000000000000000000000000000000000DE000000DD000000EE00CDED00000DB00CEE0DEE0BCDECFDBFFFD00C0000000BC00CCBBCCCCCCCCCBBBBBCCBBCCBC0DBBBBFFDFDFDDDCCEEDDEEDEDFFFEFFFFFFFFFFFFEFEDEFFDDCFFFFFFFFDFFFFFCFFDFFFDEFEEDFFFSSSSUFSSQP0RTCB000C0DSDSQTRUFUVVUVFVUVVUUEEEEFFFEEEDDDDDDECDCDEEFFEDD000DDDDB0000C0000000000CCCDCB00
0000000000000000000000000000000000000000000000BDBB0000DC000000EF0000EDDCDDDEEDEDEEFDEEDDCCDFDDFFEEEBE00000000CCCCCCCCCCCCBBBBBCCBBCCCCCBBC9DBBBBFFDDFEEEFFFFFEDDEDDCDDFFFFFFFFFFFFFFFFFEF9FDDCEDEEEDDFFFFFEDFFFFFFEFFEFFFFFDSSSSFFRSRQ00TTDR00C00CDSQSUUFVUUVFFUUUVVUUEEFFEEFEEDDDCCCC0CDEEEECDEEDD00000DCCCCDCCBCEF0000000000ED
00000000000000000000000000000000090000000000000000CCC00C0000000EF000000000000CB000DEECDCDDDFBFFDEFECCESG00000009CCCBDBBBCCCBCCCCCBDCCBBCBC0DBBBBFFDEFFEEDEDDEFEEEEEEEDEFFEFFFFFFFFFFFFFFFEFDDCEEEDEFFFFEDFFFFFFFFEEFFFFEFFFFFFFFFDCCCBBACBTRRB0000DDTTUUVUUVFFVFVVUUUTTDCSCCDDCED0DDEEEFF000EEEEEDEE00000000000CB000000000EEEED0
00000000000000000000000000000000090000000000000000000DDDC0000000FF000000000DEEEEFFEEDEFEDDDFCFFDEETTTTTTUSQQPP00CCCCDBBBCCCCBCCCCBCCCBCBBCADBBBBFFDEFFEDEDEEDEEDDDDDEEEEFFFFFFFFEFFFFFFFEFEFEDEFFFFFFFFFFFDEFFFFFFFFDDFFFFEEFFFFFFFECCCCBBSREEBBBCBDEETUUVFFVVVUUVUUUTRP0000000000000000EFFFE000DEEDDEED000000000CCDEEEEDE000000
00000000000000000000000000000000000000000000000000000000DEEDEDEEEFFDDDDEEEEEDDBBDDCDBACEFFEFCFECEEEEFUVUUUURRQQACCBCDBBBCCCCBCCCCBCCCBCBACACBBBBFFDEFFEEDEEEEEEEEEDEDDDDDFFEFEFFFFFDDDEFFEFFFFFFFFEFFFFFFFFFFFFFDDDFFFFCFFTDFFEDDFFFFFFDFECCCCCCCDFEFEDEUUUVVUSSRRRQQP00000000000000000000CDFEEC00000DDDFEDDDEECEFDDCC0000000000
0000000000000000000000000000000000000000000000000DC0000CCDDE000000DEFFE00EEC000000DEECDDCDEFFFFFDEEDEUUVVUUUUSRRCCCCDBBBCCCCBCCCCCCCCBCDBCACBBCCFFDEDDEFFFFFFFFEEEEEEEDDECFFFFFEFEFFFFFFFFFEFFFFFFEFFFFEDDEFFFFFFFFFEEEFFFFFVTSQR0CDFFEFECBDDDCDDFFFEEEDETRRRRQQQPP000000000000000000000000CD0CEEC0000EE0000000000000CCCCCBBBCCD
0000000000000000000000000000000000000000000000000BDBDDA0000000000EFEDDDDB000000BDDEEEEDDEDDFFEFEFFFUUUTUVVVVUVUTCCBCDCCBCCCDBCCCCCCCCCCCBBACBBCBFFDEFFFFFFFFEDDFFFFFFEFEDDFFEFFFFFFFFFFDEFFFFEFFFFFFFFFFFFFFFFFEEDDDFFFEEFUTUVUTTEBDRDABBBDEFFFFEFFFFDDDDDPP99000000000000000000000000000000CC000EE0000EED0000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000FF00000BEEEFEEFFFEDEEDDDEEEDFFFFEFFVVVUVUVVFFFVECCCDDBCCBCCCBCCCCCCCCCCCBCACCBBCFFDEFFEEEEDDFFFFFFFFFDDEFEFFEFFFEDFFDDFEEBFEFFFFFFFFEDEECEFFFFFFFFFFFDDSSTTTUFFFFFFFFFEEDBCCDEDEEEFCEDCD0000000000000000000000000000000000000C0000EED000CFF00000000000000CDBCDCD
000000000000000000000000009000000000000000000CCBDB000000000000FFE0000DDCBCCBEEEEEEDB00000CEEFFFFDDUUVFFVVFFFFFFEBCBCDCCCCCCCABCCBCCCCBCCBBBCCBBCFFDEFFEEEEEEEEEDDEEEFFFFFFFFFDFFFFFFFEFEECFEDCFEFFFFFFFEDDCDDEFFFFFDEDCSDETETQSRRTGCFFFFFFFFFFEE0CFBD00000CBB000000000000000000000000000000000C00000DD0000FFF000000000DDD0000000
0000000000000000000000000000900000000000000000000BCECDDCDB000FF0000000000EEEECBCC00000000CCBCFFEFDUUUVUVFVVFFFFEBBCCDCBCCDCCBCCDCCBCCBCCBBACBBCBFFEEFFDEEEEEEFEEEEEEEEDEDDFEFFFFFFFDEDDDE0FEFFFFEEDDEEFFFFFFFFFDECDEFDEFEDADB9C0CD00000CBBCB000DBDD0000CBC0000000000000000000000000000000000000DD0000DD00000FFFE000CDD0000000000
00000000000000000000000000000000000000000000B0BDDDDC00000CDEFEEDEEFEEEEFEE000000DDCTTSTTD00000EFFEEUUUVVUUUVVVVECBCCDCCCCCDCBBCCCBCCCCCCBCACBBCCFFDEDFFFFFFEFFEEDEDEEEEDECFFFFFFFFFFFEFFFFFFECEFEDDEDDDDEDDDDDDDFDDDE090AAB9AABDD00C0BCCB900000EDD00AAC00000000000000000000000000000000000000000CEDCB0DD00000EEEEEEDEECCCCDEEFFE
0000000000000000000000000000000000000000000DEDD0000000000FFE000000000000000000000PQQRRQQQ0000B0EFFEERRTUUUUUUUVDCBCCDBCCBCCCBBCCCCCCCBCDBCACBBCCFFDEEFFFFFDDDEFFFFEFEFFEDCFFFFFFFFFFFFFDEBFECCEEEDDDEDEDEDEDDEEEFDDCFB9999A9AC0EG0BBBBCB000000CCC09AA000000000000000000000000000000000000000000000CC0CAEDDDDDCDE00000CDDDEFEEC00
000000000000000000000000000000000000000900000000000000CFFF0000000000000000000000QQRTUUSRRQ0000CCCFFFEEQQQRSTUUUSCBBCDBBBCCCCBBCCCCCCCCCCBCACCBBCFFDEFFEEDFFFFFFFFFFEDDDFFEFFFFFFEEEFDEFDECEECCEEEDEDDEDDEDEDEEEEFDDCF0AABBAAABCCBBBBBCC00000CC00CD00BB00000000000000CCCC0000000000000000000000000000CCDBF000000DDEB0000000000000
000000000000000000000000000000000000000000000000000FFFF000000000000000000000000PQRTUUUVVUFE0000000EFFFEECPQQQRQBBBBDDBBCCCDCBCCCCCCCCCCCBCACCBCCFFDFFFDEEEEEEEEDDEEFFFFFFFFFFEDDFFFFEEFEFBFFCCEFEDEEEEEDEDDDEDEDFDEDFC00A0A9CC0ABBBBBD000BDCCBCDDBDDCD000000000CCCCC00000000000000000000000000000000000DEEBB000000EEEE0000000000
00000000000000000900000000000000000000000000TFFFEFFE000000000000000000000000000PQRTUUUUFEEECDDED0000CFFEEDCCBAABBBCDECBCCCDCBBCCCBCCCCCCCCACBBCCFFDEFFEEEEDEEEEEDEEDEEDDDDFDEFFFFFFFFFEDE0FFCCEFFDEDEDDDEEDDEDEEFDECFCCAAAAAC0BBABBBBD0DCDEDB0DDDCDBDB0000CCCCC000000000000000000000000000000000000000000EC0CCCC00000CEDEDEFEEDD
00000000900000000000000000000000000000000000RUS00000000000000000000000000000000PQRSTUUTTDDCDDEFEFFFFFFFEDCEEEEACCBBDECCBCCCCBBCCCCCCCBCCBCACBBBCFFDEDFFFFFFEEEEEDDDDDEEDDDFFFFFFFFFDDDFFE9FFCCEEFEEEEEEEEEDEDDEEFDDCFBBABBAABABBBBBBDBDECDE000DDD000BCCBCC00000000000000000000000000000000000000000000000BE00000CDD0000000000000
000000000000000000000000009000000000000000000000000000000000000000000000000000009QQQRQQQ90000000000000BEDCCCEDFFECCCCCBCCCCCBCCCCBCCCCCCACACCBBCFFDEFFEDDDDFFFFFFFFFFEEDDDFFFFFFFFFFFEFEEDFFCBFFFEEDEEEDDEDDDEEEFDDCF0BDDBBCBBABBBBCDE00BCBCDCC00A0CDC0000000000000000000000000000000000000000000000000000FF000000DC000000000000
00000000000000000A00000000000000000000000000000000000000000000000000000000000000000000000000000000000000CBEEDEEFDFECCBBCCCCCBCCCCCCCCCCCACBCCBBCFFDDFFFFFFFFFFFFFEDDDEFFEFFEFFFFFEEFEEFEECFFCDFFFEEEEDEEEEEEEEEEFDDCF000BA0ABBBBCBCCED00CCCCC00000CDDD00000000000A0A0090A00A0AA0A00A0A0AA090AA090000AA0A09AFF0000900CB0000000000
000000000000000009000000000090000000000000000000000000000000000000000000000000000000000000000000000000000BDDEFBEEEFEDBCCCCCCBCCCCBCCCCCCBCBCCCCCFFDEFFDEEDEEDEDDEFFFFFFFFFFFFDDDEFFFFFFEFCDEDDFFFEEEEDDEEDDDDDEDFDDDFBA0AAABBBBCBBDFEBBCBCC000000CCEDC00000000000000000000000000000000000000000000000000000BFDD000000E0000000000
0000000000000000000000000000900000000000000000000000000000000000000000000000000000000000000000000000000000ACDCFFEEEEEEBCCCCCBCCCCCCCCCCCBCBCCBBCFFDEFFEDEDEEEEEEEEEEEEEDEDFEFFFFFFFFFFFFEADFCDFFFFEEEDDEEDDEDEEDFDDCFBBABBBBBBCFFEFFCBCDDC0000BDDEEBCB00000000000009000000000A0000000A0900B0A000000000000000CFDCC000000000000090
00000000000000000000000000000000000000000000000000000000000A0A9090AA0A09AAA0900A090A909099090000900000000000ACDDCCEFFEEFCCCCBCCCCCCCCCCCBCBBCBCCFFDEFFFEDDEEFEEEDDEFEEEEECFFFFFFFDEDCDFFDDFFCCFFFFEEDEEEFEEEDDDEFDDDEBBCCCDBBEFECBBCCCCDDBCDDCDC00000090000009A0000A0AA0A0AA0000B0AAAA00B0A0AA0A0AA0900A00009CFEADDDECDB0A000000
00000000000000000000000000000000000000000000000009B0A00A0A0AA0A0A00A0A00B0A00A0A090090900000000000000BCBBCCBCCCBCBEEFFCFFECCBCCCCDCCCCCCBBBCCBCCFFDEDDDEFFEEFFEFFEFFEEDDECFFEFDEFEFFFFEFFFFFCDFFFEEEEEEEEEEEEEEEFDDDEBBDDCCCDEEDCDCCCCDDCB0BDBBC000000A0000900BCCCBCCCA000090AA0A00A0A0AA000000A00A0A00A0900009FFB00000BCCCC0090
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000CCCBBCCCBG0BCCCFFFCCEFDCBCCCCCCCCCCCBCBCCBCDFFDEFFFFFFFFFFFFFEDDEFFFEFFEEDDEFEEFFFFFFEFFEDFFFEEEEEEEEEDEEEEEFEEDFCBCCDCCDDDEEFFCCDDDCBCBA09000AAABBBCCBCCC00000000000000000000000000000000000000000000000000EFFB000000000000
0000000000000000000000000000000000000000000000000000B0000A000AA0A0AA00000090000A0000009000090000000000000000ACCBCCCEFFFCCEFCBCCCDCCCCCCCBBBCCBBDFFDEFFEEDDDEEEDEFFFFFFFFFFFFFFDDDDEEFFEFEDEFEFFFFFEEEDDEEEEEDEFEFEDDEEFEEDCCDDFFFFEBCCDDDED00CCDDDDCCA00000000000000000000000000A0A000000000000000A000000000000000EFEE0000000000
0000000000000000000000000000000000000000000000000000000000000000900A0A0AA0A0900A0A00900000090000000000000000000BBCBFFEFCCCFCCCCCCCCCCCCCBCBBCBCDFFDEFFEEDEEEEDDDEEEDEDEEDDFEEFEFFFFFFFFDFCFFFFFFFFEEEEEDEEDDDEEEFEDDEDFEFFFFEFFFFDCDDDDBA0CCD0B00C0A0090090000A0A00A0AA0A0090AB0A0ABAA0AA0A0AA0A009000090000A00000000EFEEE000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000BBBBBBBBBBBBBBBBBBBBBBBBCCCCFFDFCBFFCBCCCDCBCCCCCBBBCCCCDFFDEEEEDDEEEEDEEEEEDEEDEEDFFFFFFFFFFEEFDFDFEFFFFFEEDEEEEEEEEEEEEEEDDFDFFFFFDCFDDCBBDED0BA00000CCCDB0ACCCBBBBBBBBBBBBBBBBBBBBB00000000000000000000000000000000000000000000DEEEE00
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000BBBBBBBBBBBBBAAA00000000CCBFFDFFFFFDBACCCCDCCCCCCBCBCCBBDFFEFDFFFFEFFFFEFFFEDDEDDEDFFFFFFFFFFDFFEFEFFFFFFFDEEEEDDEEEDDEEEFEDCFEEFFFFEEEDCBC0000BDDDDDDDDBC00C0BGGGGGGG000G00GGG0GG0000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000000000000AA090AA0A0A90A0AA000000000000000000CFFCCFFEFFFFFCCCBCCCCDCCCCCCBBBCCBBDFFDECDCDCDDDDCDDDDEFFFEEFFFEFFFEFFFEFFFEFDFFFDEFFFEDEEDDFEEEEEEEEEECFEEFFFDDCBCCCAA0BCBD00DDDCA00BAB0A00000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000A00A0A00B0A00B0A0AA0B0A00A0A00009000000000900EFFFEFFBFFEEFFBDCCDBBCCCCCCDCCCCABBBCBBDFFDFACABBBBBBBAAAA000BCDCDCCCCDDDDEFFDDFFFFFCDFFFFEEEEEEEDEEEEEEEFDCECCCDCCBCBCCBC000000C00000C9ADEDDC00000000000000000000000000000000000000000000000000009999A99999900000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000DFFE000CCFFCBDFEBCCBCCBCCCCDCDCCCCBBBBCBCDFFDFBDDDDDDCDDCDEDBDAAAAA0BBBCCCFFFEFFFFFFEFFFFFFFEEEDEEEEEDDDEEEFDDFCCCDACBBBCBCDDCBB00000000ACCEEDDCACCCBCDDC0000000000000000000000000000000000000000000099999999900000000A000
00000000000000000000000000000000000000000000000000000000000A0AA0A09A0A09A0A0AAAA0AAAA09099090990AQQQUED090BCD0FFDCCFFBCCCBCCCCCCCCCCCCCCBBBBCBBDFFDFCECBDEDEEDCCEFEDECCEDDACCEFFFEFEFFFFFFFFEDFEFFEDDEEDDEEEDDEEEFDDFACCDCCBBB00BCC00A000DB0B0900CAACC00000000000000000000000000000000900000000000000000000099999900000000000000
000000000000000000000000000000000000000000009A0A09BBB09AAA000A90A0AA0000A0A0AA0A0AA090A0000000AQRSTUUTRQ90000FFBDCFFCCCCCBCCCDCCCCCCCCCCBBBCCBCDFFDFCEDEDEDEEEFEEFCEDECEDCDEEFEEEDEEFEEFFCFFDCFEFFFEDDEEEEEEDEEEEFDEFCECCBBBBBABB0BBBBCCDCCCC09000DA00DDCCC000000000000000000000000AA99999999999999999A0000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009QRUUUUUTSSBCBDFEBCDFDCCBCCBCCCCCCCCBCCCCCBBBBCBCDFFCFCEDCEECDEEFEFFADCFEDDEEEEEEEFFEA0EDEFAFFCCFEFFEDEEEEEEDDEEEEDFDDFBABABCBBBABCCCC0000CDEECCDD000CCB00000CCCDBDCCCG0000000000990999999999999999999999900000000000000000AAAAAAA
0000000000000000000000000000000000000000000000000000000000090000A0AA0A0000A0A000000090A0AA0009QRSUUUUUSRQ000FF0CCFFDCCBCCCCCBCCCCCBCCCCCBBBCCCCDFFDFFFFEEEFFFEDFFCECDDDCEEEDFDEFEBBAACDEFAFFDCFEFFEEDDEEEEEEEEEEDFDDFBBBBBB0A0000BA0BADCB000CC0DDDCDCB00000000000000C00000000000000000000000000000000000000000000000000A00000000
0000000000000000000000000000000000000000000000000000000000000AA0B0AA0B0AA0A0AA0A0AA0A0B00A0909AARSTTTTRQPBBBFD0CEFCDCBBCCBCCBCCCCCBCCCCCBBBCCBCDFFDEFFFFFFFFFFFFFFFFFFFFFFFEEDEEEEDDEEFEEBFFCCFEFFEEEDEDEEEEEEEEDFDDFCCCABABBA00000C000BBBCB0EE00BCACC000000000000000000000000000000A9999999999999000000AA0000000000090000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009QRSRSSQS00CF00BFFCDCCBCDCCDBCCCCCCCCCCCBBBBCBBDFFCEEEDDDDDEEDEEDDDEEEEEFFFFFFFFFFFFFFFFEBFFCCFEFFEDEEFEEDEEDEEEDFDDECCCCCCC9BB0000CCC00DA00CCFFC0DCA00000000000000000000000000000000000000000000000000000A000000009000000000000
000000000000000000000000000000000000000000000000000000A000000000000000000000000000000000000000000RSSQQRSR00CFCCBFEBDBCBCCCCCBCBBCCCCCCCCBBBCCCCDFFDEDEDDDEEEEEEEEDDEEEEEECFFFFFFFFFFFFFEEFFFCDFEFFEEEEEEEEEEEEEECFDDEDB0BDCCC0CB00000CBBB00BBCDFEC0C0A00000000000000000000000000000000000000000000000000000090000900000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000GSGR0PSRSSCCFF0ADCCDBBBCCCCCCCCCCCBCCCCCBBBBCBBDFFDEEEDDDDEFEEEEEDDDDDEDEDFFFFFFFFFFEFFEEFFFCDFEFFEEEEEDEDEEEEEECFDDEDAACCCBBDADB0A000BBC0000CC0EF0CCCCCG0000000000000000000000000000000000000000000000000A090000000000000009999
000000000000000000000000000000000000000000000000000000000000000000000000009000000000000000000B0GSQRRSSSTSQA0EF09BBCDCCBCDCCDCDCCDCBCCCCCBBBCCCBDFFDEEFEEEFFFFFEEEDEEEFFFFEFEDEEEEEEEDEFEEFFFCCFEFFEEDDEEEEEEEEEECFDDEDCCC0AAADDEBA0BCBCCDDB000CBBDD0CA00CCCCC0000000000000000AA99A99999A9999990000000AA00000A000000000000A000000
000000000000000000000000A9999999999990000000000000000000000000000000000000000A0A000000BAA0A00BGR0ARRR0A0RQ00CFFBCCCEBCBCDBCCBCCCCCCCCCCCBBBBBCBEFFDEDDDFFFFFFFEEEEDDDDDDDDDDDDEEFFFFEEEEECFFCCFEFFEEEEEEEEEEEEEEBFEDEDCCCBBABDEDEE00DECD0CDD00CC0EECBA0000000DCCCB000000000000000000000000000000000000000000A0000000090000000000
0000000000000000000000000000000000000000000000000000000000000000000000000000AA0A0A0A00ABA0B00BS000SQR0A0B00BBDFBCDCEBCBCCCCCCCCCCCBCDCCCBBBBCBBDFFDEFDDFFFFFFFEEEEEEFFFFFFFEEEFFFEFFFFEEFCFFCCFEFFEEDDDEEDEDEEEEBFDDEEFECCDCCCCCBDD00D0BCCCCCCCDBBEC0000000000000CCCCD000000000009A999999999900000000900000000000000000000000000
99999900000000000000000000000000000000000000000000000000000000000000000000000A0A0A0A0A0AA0AA0SR00QCEFFFFFED0B00BBBCDBBBBCCCCBCCCCCCCDCCCBBBBBCBDFFCEFDEFEEEFFFEEFFFFFFFFFFFEEFFEFFFFEFFEFCFECCFEFFEEDEEDEDDEDEDDCFDDEEFFFFDDCDCCBCBBBCBABBCCCCCCBEFBCEFFFFFFE0000000000000000000000000000000009000000000000000000000000000000000
0000000000000000000000A000900090000000000000000000000000000000000000000000000A0A0A0AAAAAA0A00RFFFFFFFFFFFFFFFFFBBBCDBCBCDCCCCBCCCCCCCCCCBBCBCBBEFFCEFDEEEDDDDDDDDDDDFFFEDFFFFFFFFECEFFFEFDFFBCEFFFEEDEEEEEEEEEEFCFDDEEFFFFFFEDDDDCCCCBBBBBCCBDDBBCEDFEEFEEEFFFFFE000000000000000000000000000000000000000000000000000000000000000
0000000000000000000090000000000000000000000000000000000000000000000000000000A90A0A0B0AAAA0BFFFFEP0B0A0A000B00CFBBBCDBBBBCBBCBCCBCCBCCCCCBBBBBBBEFFCEEDEFEEDEEEEFEEFFDCFFFFFEFFFDEFFEEEEFFFEECCEFFFEEDDDCCDDDDEDECFDDEEEEFFFFFEEEFFFECBBCBBBCDCCBCCEEEFD0000000DFFFEAA000000000000A099999999909A000000900000000000000000000000000
0000000000000000009000000000000000000000000000000000000000000000000000000000AA0A0A0A0A0ACFFFSQ00Q0C0A0B000B0000BCCCEBCBBDBCCCBCBCCBCCCCCBBBBBBBEFFCEEEEFFFDEEDDEFFFFFFFEFFFFFFFFEFFFDEFEEFFFCCEFFEDDDDEEEDDDDDDDCFDEEEDDDD0ABBEDEFFFFDDDCBCDEFDFDEFECFEC000000000FFFB00000000000000000000000000000000000000000000000000000000000
00000000000000000000000000A99999999999999999A9000000000000000000000000000000AA0A0A0A09BDEF0BPS00Q0A0A0A000B0000CBBCEBBBBCBCCCCCBCCBCCCCCBBBBCBBEFFCEEEEEEEEEEEEEEEEEFEFFDFFFFFFFFDEFFEFEECDFFCEFFEEDDDDEEEEEEEEEDFDDEEDCBD0A0CEDDCBDEBCCCCEEDFFFEDEBC90CCC0000B00BCEETSPP9000000000000000000000000000000090000000000900000099909
0000000000000000000000009000000000000000000000000000000000000000000000000000AA000A0ABCDCC00B0SR00RA0B0A000B0000BCCCEBBBBCBBBBBBBCCBCCCCBBBCBCBBEFFCEEDEFFEEEEEEEEEEFEFEEFDFFFDFFEFDEFFFFECEEFFEFEEEEEEEEEDEEEDDEDFDDEED0CDAC0C0DCC0AED000DDDDFFFEA00BA000000A0AA0B0EDTUUTRQA0000000000000000000000000000000000090000000000000000
0000000000000000000000A00000000000000000000000000000000000000000000000000000AA000B00CCBA0A0B00SG0RS0B0B000B00A0CBCBECCCBDCCCCCCCCCBCCCCCBBBBBBBEFECFEDDFEFDEEFEEFFFFEEFEFFEFEFEFFFEFEFEEFBEFCFFFEEEDDDDDDDDDDDDDDFDEEE0ADDBB0BBDEBCCDD000DBBC00CDD00CD090000A0BAAAPRSUUUUTRQQ000000000000000000000000000000000000A00000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000A000B0000AA000B000RGQR0B0A000B0000BBBCDBBBBDBCCBBBBCCBCCCCCBBBBBBBEFECFEDEFEFDCDDEEDFFEDEEFEFEEFEFDFEFEDEFFFBDFCCFEFFEEDDEDEDEDDDDDDEDDEECCC00B000EDCEC0BEC0B0CC0BCDDD0090A000BA09AABQRTTUTTTURQPAAA99999900000000000000000000000000000000000000000
99999000000900999990000000000000000000000000000000000000000000000000000000000A000B000000000A000GSSQQB0B000B00CBBBBBEBCCBDBBBBCCCCCBCCBCCBBBBBBBEFECFEEEFEEEEFFFFEDFFEEDEEFEFFFFEEEFEDEFEFFCFCDEFFEEDEDEEEEEDDEEEEECDDEDB0B0DB00090E0BAEE0DBDE0CCDBC000AA0A0090B0AAPRSTTTTTTTQP00000000000000000000009000000000000000000000000000
9AAAAAAAAAAAAAAAAA000000000000000000000000000000000000000000000000000000000090000A000000000A00009RSSSQB000BCCC0BBBBDBCBADBBBCDDCCDBCCCCCCBCBBBBEFEDEEDEFEEEFFCFFEEFFFEEEFFEFFFFFFEFEFFFDEFDFCDBFEEEEDEDDDDDDDDDDDEDDEED0DC0DC00000ECB0EECDBDB0BCBDD0C0BC0A00A0A00B9RRRTTTTRRQ9000000000000000090000090AA000000000000000000000000
9999999999999999000000000A000000000000000000000000000000000000000000000000000A000B000000000B00000RRUUTRA0SSSA00CBBBDCCCCEDDDDDCCCDCCCCCCCBCABBBEEECEFDEEEECEEEFEEFEEFFDCEFFEEFFEFEFCDEFEEEFFCDDFFFFFFFEFFFFFFFFFFFDDDE00DCAED000DEDBAABEEDBB0B0BBDCBDA0B0A00A0B0AA0AAQQQQQQP0000000000000009000000000000000000000000000000000000
000000000000000000AA090000000000000000000000000000000000000000000000000000000A000B000000000B00000AQRTSSRSSSQAAABBBBCCCEEDCFDCBCCCCCCCCBCCCCBCBCEFEDEEEEEEEEEEEDFDDEEEFEEEFDFEFEEFDFDDEFEEFEFDDDEFEEFEFFFFEEDDDDDDDDDDE00C0BBC000C0D0B00EFCDD0BC00BCCDEBB0A0A90A00A0A000000000000000000000000009000000000000AA000090000A0000000A0
00000000000000000000900A0000000000000000000000000000000000000000000000000000AA000B000000000A00000B00QRSRQPRA900BBBCBEEEDDFEBBCCCCCCCCBBCCCCBCBBEFEFFFFFFFEEEEFFDFEEDDFEEFDEFEFFFFEFFFEFFFEFFEDDEFFDDDDEEEEFFFEEEEEEEEEDDD0ABC0000000C00BFFA00ACAACBCABAA0AA0A0A09A0A00000000000000000000000000900000900000000000000000A000009000
00000000000000000000009000AAAAAAAAAAA9000000000000000000000000000000000000000A000A000000000B00000AA0Q9RRRRSRACBCDCCEFDCDFDBCCCCCDBCCCCBDCCCCCBCEEEFFFFFFFFEEDEEEFEEDDFDEFEEFFFDFDEFFFFFFFFFFFFEEEFFFFFFFFFFEDEFFFFEEEEFEED00000000000000FF00000B0000BBAA0BA0A0B0000A000QRSSRQ00000000000000000900000900000000000000900A000000000
00000000000000000000000090000000000000000000000000000000000000000000000000000A000A00000000AB00000AAQSRRRUUSABBCCCDFFDBDFFCDDDDCCCDDDDCCCCDDDDDEFFFFFFFFFFFFFFFFFEFFEEFEEEEFEFDFFEEFEFFFFFFEEFFEFFFFFFFFFFEFFFFFEEFEEEDDDDFFFE00000000000DED000000000A0PQRRPAA0A0000B00PQTTTTSP0000000000000000900000000900000000000900A000000900
0000000000000000000000000A900000000000000000000000000000000000000000000000000A000000000000AA00000APTUUTSUUCBBBBBCFECDDDEECCBCDDCDCCDDDDDCCCCDDDFFFFFFFFFFFFFFFFFEEEEFEDFDDFDFEFFFFEEFEFEFFFFEFFFFFFFFFFFFEFEFFFEEFEDEDDDDC0CFFFFFD000GPTTUUSP00B0000A0PSTTRQA0A0000000PQSTTTRP0000000000000000000000000009000000000000A000000900
00000000000000000000000000000A000A000000000000000000000000000000000000000000AA0000000000000B00000A9QTTQQQQBCCBBEFEBCBDDFCCCBBCDDCBCBBCBCCBBBABBDDEEDEEEEEFEFFFFFEEDEFDEEEFFEFEFFDFEFFEEFFFFEFFEFFFFFFFFFFEEEEEEEEFFFFFEFFFED00000FEFDQQTTUUTQQQQ0000B0PQSSRRRAB000000AQPQRRQR00000000000000000000000000000000000000000A000000900
0000000000000000000000000000000900000000090000000000000000000000000000000000000000000000000B00000A00000000BABCFFDDCDCDCFBBCBBBDDCBCBBCBBCABCADBDEEDEEEFEEFFFFFFEEEDFFEFFBFDFEEEFEFFFEDFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFEDD000CFETTTUUURQQR0000B000QQRRQ0A00000A0000RQ00A0000000000000000000000000000000000000000A090000900
0000000000000000000000000000090000000000000000000000000000000000000000000000000000000000000B00000AA000000DCCCFFCCCCCDDEEBBCBBCCCCBCBBCBBCBBBABCDEEEEEEEEEFFFFFFEFEDFDDDFCFDFDEEFFEFEECEEEFFFEFFFDFFFFFFFFFFFFFFFFFFFFFEEDEDEDEDD0000PFFTTUUSRQQR0000A000000RRRA0QA00000ARQAA00A000000000000000000000000000000000000000A0A0000900
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000A00000A0000CCBCCDEECBBCCDDDFEDDCCCCCCDDDCCDCBBABBACBDEEEEEEEEFFFFFFFFFEEFDDEFEFEFDDEEFFFDEDDFDEEFFEFFFFEFFEFFFFFFFEFFEFEEEEDEDEDEDEDD000FFFUTTTTRRQQR0000A0000909RRRQQQPRRB00000AARQRRRRQQPAA0000000000000A0000000000000000A090000900
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000AA00000ABBCCCBCCFEDCDDCDDDDEFDDDCDDDDCCBCCCDDDDDDDDDDFFFFFFFFFFFFFFFEEFEFFEFEFFFEFEEFDDFFEEFDDFEFFFFFFFFFEEFFFFFFFFEFFEDC0000000000CFFFFFFCQQQQQQQP0AA0000B000QQQQRRUUURR000AARRQRPQRSTTTTTRQ09000000000000A000A000000000000A000000900
000000000000000000000000000000000000000000000000000000000000000000000000000000000000CEEEEEEEEDEEC0ABBBBEEEDBABEEEDBBFFECCCDDDDDDDDDDDEEDDDDDCCFFFFFFFFFFFFFFFFFFEEFEEEFEFFDFEDEEEFEFEFFEFEEFEDEFFFFFFFFFFFFFFFFFFFFFFFEEEEEEEFFEEDC000000000000A0000B00QTTTTRTUUTSQPAAAQQQPQQRSTTTTTTTQP0000000000000A0000000000000900A000000900
00000000000000000000000000000000000000000000000000000000000000000000000000000000EEFFFEEECCBBDEDDEEDDEEFEDEFEEEDDBBCFFEBCCBBCCCBCCCCBBBBCDDCCDDFFFFFEEEFFFFFFFFEEEFFEFEFDEFEFEFEEEFEDFFFFFDDEFFFF0EFFFFFFFDDEFFFFFFFFFFFFFFFFFFF000CC00000000000A0000B00QTTTSRRTTTSR000000000PQRTTTTTTTQP0000000000000A0000000000000900A000000900
9999999999999999999999999999999999999900000000000000000000000000000BEEEEEEEDCFFFEDCDEEDDDEEFEEEEEEEED000000000000FFF00ABBBBBCCBCCBCBCBBCCCABABEEEEEEEEFFFFFFFFEEEFDEDFF0DFFEFEFF0FFDFFEEFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFEFFFE000000000000AA0000A000PQQQPQQRP9QQB00000000RSSTTTTTRQ00000000000000A0000000000000900A000000900
0000000000000000000000000000000000000000000000000000000000000DDFEFFFFEDC000EFFD000000000000A0000000000000000000FFF00000000000000000000BBBBABAAEEEDDEEDC00000000FFFC0FF00CFFBEEDFFEFD0DEEEEEEEEFFFFFFFFFFFFEEECCC00000000DEDEEFFFFFFE00000000000A0000A000000000A0Q0000ARQSR0GRRPQRRRQQQQQ0000000000000A0000000000000900A000000000
0000000000000000000000000000000000000000000000000000000EEEFEEDD000000000EFFE00000000000000AA00000000000000000EFF000CEFFFFFFFFFED000000000000000000000000000EDDFFE0CFF000CEF00EEEDFDFDD00DFEEEEFEEBBB00DEEEEDFEBB00000000000000000CFFFFFD000000AB00009000000000B0A000000SUTRR000R00QP0000QRG9000000000A00000000000000000000000000
000000000000000000000000000000000090090000000000000EEFFFD0000000000000FFFC0000000000000000A900000000000EEDDDBEFFFFFFFFEDDDEFEFFFFFFFFFFFEC0000BCDEFFFFFFFFFEFFF00FFF0000EEFF00EEE00EFFFFFD00BEDEEEEEFEEEDDDFFFFFFFEEFFFFFFC00000000CFFFFFFC0000A00000000000000B0A000000RRRQ000Q00PTTQ0000QQRTTSQ90000A00090000000000000000000000
00000000000000000000000000000000000000000000000DDEFEC00000000000000FFFF00000000000000000000900DEFFEEEFEDDDFFFFEB9BCDDEEFB0DFFEFFFFEDDDCEFFFFFFFFFFFFFEEFFFFFFEFFFF0000EFF0DEE00EF000FFCDFFFFFF00CDEE000000DEFEFFE00000000EFFFFFE0000DFF0EFFFD00A0000000000000000QG000BB000ARQRQ0AQTTP0000PQTTTTRQ0000900000000000000000000000000
000000000000000000000000000000000000000000000CEEE90000000000000CEEFFC00000000000000000000DEEEEED0000000FFFFDFC000000EFFFFFFEEEDEEEEEEEEEDEFEFFFFFFFFFFFFFFFFFFFD00000FFF000DFE0DFE000FFE000DEFFFF00FFFFFEE0DFF0CFFFD0000000000DFFFFD0EF0000EFFD000000000000000AQRSRRR0000RRUUUR9000000000QQSTTTRA0000900090000000000000000000000
0000000000000000000000000000000000000000000CCEDA00000000000EEFFEDB0000000000000000000DFFEEE0000000000EFFE00EF000EFFFFDDDDCEE00000000000000000BEEEEEEEEFFDD00000000DFFF000000CFFCEE0000DFFD00000EFFF000000DEFEF000AEFFFFFEB00000000CFFEFC0000CEFF00000000000000QRTTTSRQQR00PQTSQ0000000A0000QQQQ000000A000A0000000000000000000000
`;

// Cable routes and glowing nodes traced in the reference image's coordinates.
type Point = readonly [number, number];
const ROUTES: readonly (readonly Point[])[] = [
  [[688, 17], [728, 30], [752, 68], [747, 118], [719, 140], [683, 142], [626, 151]],
  [[1008, 0], [966, 68], [949, 128], [910, 177], [853, 208], [795, 207], [741, 182], [689, 156]],
  [[858, 0], [869, 59], [893, 127], [875, 171], [833, 189], [778, 181], [713, 160]],
  [[370, 285], [417, 294], [455, 317], [480, 354], [488, 403], [465, 465], [468, 517]],
  [[1137, 577], [1107, 537], [1064, 520], [1023, 535]],
  [[656, 508], [712, 527], [748, 575], [753, 635], [799, 687], [887, 714], [990, 739]],
  [[698, 510], [739, 543], [772, 606], [807, 657], [866, 682], [939, 697]],
  [[719, 347], [770, 349], [809, 371], [817, 404], [789, 431], [737, 450]],
  [[514, 598], [487, 629], [468, 675], [413, 702], [346, 701], [270, 723], [202, 758]],
  [[724, 515], [700, 545], [701, 606], [729, 662], [717, 707], [687, 767]],
];
const NODES: readonly Point[] = [[237,96],[196,289],[429,443],[431,602],[434,646],[1068,646],[1146,638],[1099,695],[1180,698],[1106,765],[1228,749],[1154,755],[1185,743],[1004,660]];
const TAU = Math.PI * 2;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const grid = ([x, y]: Point): Point => [x * meta.cols / 1376, y * meta.rows / 768];

export default function wiredIntelligence({ speed = meta.options.speed }: Partial<WiredIntelligenceOptions> = {}): Frame {
  const { cols, rows } = meta;
  const size = cols * rows;
  const art = ART.slice(1, -1).split("\n").map((row) => row.padEnd(cols)).join("");
  const ink = Uint8Array.from(INK.slice(1, -1).replace(/\n/g, ""), (ch) => parseInt(ch, 32));
  const glow = new Float32Array(size);
  const out = new Array<string>(rows);
  const rate = Number.isFinite(speed) ? Math.max(0, speed) : 1;

  // Sample routes by length so packets move smoothly through each bend.
  const routes = ROUTES.map((route) => {
    const points = route.map(grid), samples: Point[] = [];
    for (let i = 1; i < points.length; i++) {
      const [ax, ay] = points[i - 1], [bx, by] = points[i];
      const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, (by - ay) * 2) * 2));
      for (let j = 0; j < steps; j++) samples.push([ax + (bx - ax) * j / steps, ay + (by - ay) * j / steps]);
    }
    return samples;
  });
  const nodes = NODES.map((point) => {
    const [cx, cy] = grid(point);
    const cells: [number, number][] = [];
    for (let y = Math.max(0, Math.floor(cy - 3)); y <= Math.min(rows - 1, cy + 3); y++)
      for (let x = Math.max(0, Math.floor(cx - 6)); x <= Math.min(cols - 1, cx + 6); x++) {
        const d = (x - cx) ** 2 + ((y - cy) * 2) ** 2;
        if (d < 36) cells.push([y * cols + x, Math.exp(-d / 9)]);
      }
    return cells;
  });
  const dab = (x: number, y: number, strength: number) => {
    const ix = Math.round(x), iy = Math.round(y);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -2; dx <= 2; dx++) {
      const xx = ix + dx, yy = iy + dy;
      if (xx < 0 || xx >= cols || yy < 0 || yy >= rows) continue;
      glow[yy * cols + xx] += strength * Math.exp(-(dx * dx + 4 * dy * dy) / 2.4);
    }
  };

  return (t, { color, paper = false } = {}) => {
    const time = ((t * rate % 12) + 12) % 12;
    const phase = time / 12;
    glow.fill(0);
    nodes.forEach((cells, i) => {
      const pulse = 0.22 + 0.28 * (0.5 + 0.5 * Math.sin(TAU * (phase * (i % 3 + 1) + i * 0.173)));
      for (const [k, weight] of cells) glow[k] += pulse * weight;
    });
    routes.forEach((route, i) => {
      const head = (phase * (i % 2 + 1) + i * 0.127) % 1;
      for (let trail = 0; trail < 12; trail++) {
        const p = ((head * route.length - trail) % route.length + route.length) % route.length;
        const [x, y] = route[Math.floor(p)];
        dab(x, y, (1 - trail / 12) * 0.7);
      }
    });
    // Indicator lights stay on the right of each front-facing server unit.
    for (let i = 0; i < 8; i++) {
      const [x, y] = grid([772, 215 + i * 43]);
      dab(x, y, Math.max(0, Math.sin(TAU * (phase * 6 + i * 0.21))) * 0.7);
    }
    for (let y = 0; y < rows; y++) {
      let line = "";
      for (let x = 0; x < cols; x++) {
        const k = y * cols + x, light = clamp(glow[k]);
        let ch = art[k];
        if (light > 0.72) ch = "*";
        else if (light > 0.32 && ch === " ") ch = light > 0.5 ? "+" : ".";
        if (!color && paper && ch === "@") ch = "#";
        if (color) color[k] = light > 0.12 ? 16 + Math.min(15, Math.round(7 + light * 8)) + (light > 0.65 ? 32 : 0) : ink[k];
        line += ch;
      }
      out[y] = line;
    }
    return out.join("\n");
  };
}
