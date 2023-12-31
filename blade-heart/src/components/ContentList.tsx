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
                    <Slider id="contentlist/sort" callback={ onSortSlider } lefttext="reccomended" righttext="chronological"/>
                </div>
            </div>
            <div class="bh-contentlist">
                {
                    content.map((item) =>
                        <MediaCard type={item.type} title={item.title} desc={item.desc}>
                            <img src={item.cover}></img>
                        </MediaCard>
                    )
                }
            </div>
        </>
    )
}