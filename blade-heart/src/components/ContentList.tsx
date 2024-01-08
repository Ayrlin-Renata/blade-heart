import MediaCard from "./MediaCard"
import Slider from "./Slider"
import { content } from "../assets/json/contentlist.json";

export default function ContentList() {
    function onSortSlider(value: boolean) {
        console.log(value);
    }  

    return (
        <>
            <div class="bh-contenttitle">
                <h1>media projects</h1>
                <div class="sort">
                    <Slider id="contentlist/sort" 
                        onChange={ onSortSlider } 
                        offText="reccomended" 
                        onText="chronological"/>
                </div>
            </div>
            <div class="bh-contentlist">
                {
                    //@ts-ignore needed for def
                    Object.entries(content).map(([key, item]) =>
                        <MediaCard {...item}>
                            <img src={item.cover}></img>
                        </MediaCard>
                    )
                }
            </div>
        </>
    )
}