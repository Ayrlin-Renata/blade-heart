import MediaCard from "./MediaCard"
import Slider from "./Slider"
import { content } from "../assets/json/contentlist.json";

export default function ContentList() {
    console.log(content);
    return (
        <>
            <div class="bh-contenttitle">
                <h1>media projects</h1>
                <div class="sort">
                    <Slider id="sort" op1="reccomended" op2="chronological"/>
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