import MainPanel from '../components/MainPanel';


function setContent (component, 
    title = 'MAINFLOW', 
    subtitle='Lorem Ipsum is simply dummy text of the printing and typesetting industry. ') {
        
        MainPanel.setMainContent(component)
        MainPanel.setTitle(title);   
        MainPanel.setSubtitle(subtitle);   
}

export {
    setContent
}