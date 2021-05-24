export const scrollAreaCss = (extra: string)=>`
        QScrollArea{
          ${extra}
          border-radius: 2px;
        }
         
        QScrollBar:vertical
        {
          width: 8px;
          border:0px solid;
          border-radius: 2px;
          margin: 0px,0px,0px,0px;
          background:#F5F5F5;
        }
         
        QScrollBar:vertical:hover
        {
          width: 8px;
          border:0px solid;
          margin: 0px,0px,0px,0px;
          background: #067D17;
        }
         
        QScrollBar::handle:vertical
        {
          width: 8px;
          background: #E1E1E1;
          border-radius: 2px;
          height: 40px;
          
        }
         
        QScrollBar::handle:vertical:hover
        {
          background: #cbcbcb;
          border-radius: 2px;
        }
         
        
         
        QScrollBar::up-arrow:vertical{
          image : none;
          border:0px solid;
          border-radius: 3px;
        }
         
        QScrollBar::down-arrow:vertical {
          image : none;
          border:0px solid;
          border-radius: 3px;
        }
    `
