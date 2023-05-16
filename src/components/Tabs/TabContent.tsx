import TabContentProps from "./TabContentProps"; 
import './TabContent.css';

export default function TabContent(props: TabContentProps){
    return(
        <>
            <div className="tabContentWrapper" hidden={ props.index !== props.currentIndex }>
                {props.children}
            </div>
        </>
    );
}