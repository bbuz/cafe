default_logger = (require './logger')()
{blue, white} = default_logger


exports.draw_logo = (logger) ->
    {murmur} = if logger then logger else default_logger
    [
        " "
        " "
    	blue( "          ..,,'.               .,'. .','                       .,;,.                                            ")
    	blue( "       cON0l'cKd            lXNXk0OXNKkK,                  .kNO;';00.                    o00c              ..'")
    	blue( "     .ONNx   :NO.          lWWX. dWWO. '.                 .0WNc  .00.                    o0O:             lNWO.")
    	blue( "    .0WWk    ..   ,lddo'  .KWW0loXNNkl, .cdoo:   .codoc    lNNNx'..    .:odol. 'ooc'co: ,oo:  ,KXXoldo;  cKWNk; ")
    	blue( "    dWWX'       :KN0''0N; cNWX' lNWO. .xNXc.dN;.kNNo.cN;    'ONNNO;  .oNNk.cNl.0WNkcxN0'OWNl  dWW0;'kNWo lNW0. ")
    	blue( "   .KNWk       lNNX. ,XNxlKNNd .0WNc .0WN:.lKo.OWNl.:Ko  'cl:.;KNNN: kWWk  .. :NWK.  . ;NWK. .KWN;  lNWd.0WWo ")
    	blue( "   .XNWx      .XWWo  'X0.'NNX' cNN0. dNWXol;. cNWXdl:.  xNNd,. ;NNWd;NNN,    .OWWd     OWNl  lWNO  .OWN;:NWX. ")
    	blue( "   .0WWX:.  .;kNNWo.;KK, xNWx .0WNc  xNW0.  .cONWK,..:..KWK.   oNWX,lNNN:  .:ONNN,    ,XNN;.lXNNc 'kNNo OWWO.")
    	blue( "    .dKXNXKOx:.:kKKKkc..;XWNo,dNWK.  .d0XKOxl..oKXX0x,  'xKXOOKXOl. .o0XX0kl,dKKx      oKX0dONWKOKXKx,  :0XKc ")
    	blue( "      ...          .lo:xNWk .OWNd                         ....                            .0WN:              ")
    	blue( "                    lXolXWNx;xNW0.                      ") + white("        'lll.    ;d'   ") + blue("           cNWK. ")
    	blue( "                     ;odo:.cddo;                             ") + white("  'Wl      .:  ") + blue("              cl:. ")
        white("                                           .lxllll.  ;ccllxl  ;xMkl; .odlclxo.    ")
        white("                                          .KK.       .:lookM;  ,M:  .KXc:::oWk    ")
        white("                                          .X0       ;Nc...:M:  ,M:  .N0,'''''.    ")
        white("                                           .kOc;;l. 'Xx;;lOM:  ,M:   ,0kc;;:o'    ")
        white("                                             .','.    ','. '    '      .','..     ")
        " "
    ].map (line) -> murmur line if line



