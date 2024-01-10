import ShareButton from "./ShareButton";
import MultiIcon from "./MultiIcon";

import ShareIcon from '@mui/icons-material/Share';
import LinkIcon from '@mui/icons-material/Link';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ImageIcon from '@mui/icons-material/Image';
import { useContext, useMemo, useState } from "preact/hooks";
import { saveAs } from "file-saver";
import { buildPageSrc } from "../utils/jsonutils";
import { MangaNavContext } from "../routes/ChapterReader";

interface PageLabel {
    pos: number,
    index: number
}

export default function ({ pos, index }: PageLabel) {
    const host = location.hostname == "localhost" ? `${location.hostname}:${location.port}` : location.hostname;
    const url = `${location.protocol}//${host}${location.pathname}`;
    const sharePageLink = url + "#page" + index;

    const mangaNav = useContext(MangaNavContext);

    const pgSrcObj = buildPageSrc(index,mangaNav.chapter.numeral,mangaNav.language,mangaNav.id)
    const copyImageLink = pgSrcObj.src;
    const copyImageLinkType = pgSrcObj.type;

    const [feedbackText, setFeedbackText] = useState("");
    const [flash, setFlash] = useState(false);

    var timeoutId = 0;
    var flashlock = false;
    function flashFeedbackText(text: string) {
        flashlock = true;
        setFeedbackText(text);
        setFlash(true);
        setTimeout(() => setFlash(false),0)

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            setFeedbackText("");
            flashlock = false;
        }, 1000);
    }

    function sharePageLinkClick() {
        flashFeedbackText("Page Link Copied!");
    }
    function copyImageLinkClick() {
        flashFeedbackText("Image Link Copied!");
    }
    function copyImageClick(success:boolean) {
        flashFeedbackText(success? "Image Link Copied!" : "Denied! Try right-click!");
    }
    function dlImageClick() {
        saveAs(copyImageLink);
        flashFeedbackText("Downloading!");
    }

    function showDesc(desc: string) {
        if(!flashlock) {
            setFeedbackText(desc);
        }
    }

    function clearDesc() {
        if(!flashlock) {
            setFeedbackText("");
        }
    }

    const links = useMemo(() => {
        return (
            <>
                <ShareButton id="sharepagelink"
                    icon={(
                        <MultiIcon primary={<ShareIcon />}
                            left={<LinkIcon />} />
                    )}
                    toClipboardText={sharePageLink}
                    onClick={sharePageLinkClick}
                    onMouseOver={() => showDesc("Copy Page Link")}
                    onMouseOut={clearDesc} />
                <ShareButton id="copyimagelink"
                    icon={(
                        <MultiIcon primary={<ShareIcon />}
                            left={<ImageIcon />}
                            right={<LinkIcon />} />
                    )}
                    toClipboardText={copyImageLink}
                    onClick={copyImageLinkClick}
                    onMouseOver={() => showDesc("Copy Image Link")}
                    onMouseOut={clearDesc} />
                <ShareButton id="copyimage"
                    icon={(
                        <MultiIcon primary={<ShareIcon />}
                            left={<ImageIcon />} />
                    )}
                    toClipboardImageSrc={ { src: copyImageLink, type: copyImageLinkType} }
                    //onClick={copyImageClick}
                    toClipboardCallback={(success) => copyImageClick(success)}
                    onMouseOver={() => showDesc("Copy Image")}
                    onMouseOut={clearDesc} />
                <ShareButton id="dlimage"
                    icon={(<FileDownloadOutlinedIcon />)}
                    onClick={dlImageClick}
                    onMouseOver={() => showDesc("Download Image")}
                    onMouseOut={clearDesc} />
            </>
        )
    }, [index])
    return (
        <>
            <div class="pagelabel" style={"top:" + pos.toString() + "px;"}>
                <div class="pagenumber">
                    <div class="text">page</div>
                    <div class="number">{index}</div>
                </div>
                <div class='linkbox'>
                    <div class="links">
                        {links}
                    </div>
                    <div class={"feedback " + (flash? "flash" : "")}>{feedbackText}</div>
                </div>
            </div>
        </>
    )
}