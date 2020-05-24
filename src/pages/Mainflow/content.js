import MainPanel from '../components/MainPanel';
import strings from '../utils/strings';

function setContent (component, 
    title = strings.WELCOME_TITLE, 
    subtitle = strings.WELCOME_SUBTITLE) {
        MainPanel.setRunningModeOff();
        MainPanel.setMainContent(component)
        MainPanel.setTitle(title);   
        MainPanel.setSubtitle(subtitle);   
}

export {
    setContent
}