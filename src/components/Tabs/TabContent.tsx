import TabContentProps from "./TabContentProps"; 

export default function TabContent(props: TabContentProps){
    return(
        <>
            <div hidden={ props.index !== props.currentIndex }>
                {props.children}
            </div>
        </>
    );
}