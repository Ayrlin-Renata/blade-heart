import ShareButton from "./ShareButton";
import MultiIcon from "./MultiIcon";

import ShareIcon from '@mui/icons-material/Share';
import LinkIcon from '@mui/icons-material/Link';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ImageIcon from '@mui/icons-material/Image';

interface PageLabel {
    pos: number,
    index: number
}

export default function ({ pos, index }: PageLabel) {
    const host = location.hostname == "localhost"? `${location.hostname}:${location.port}` : location.hostname;
    const url = `${location.protocol}//${host}${location.pathname}`;

    function sharePageLink() {
        console.log("sharePageLink")
        console.log(url +"#page"+index)
    }
    function copyImageLink() {
        console.log("copyImageLink")
    }
    function copyImage() {
        console.log("copyImage")
    }
    function dlImage() {
        console.log("dlImage")
    }

    return (
        <>
            <div class="pagelabel" style={"top:" + pos.toString() + "px;"}>
                <div class="pagenumber">
                    <div class="text">page</div>
                    <div class="number">{index}</div>
                </div>
                <div class="links">
                    <ShareButton id="sharepagelink"
                        icon={(
                            <MultiIcon primary={<ShareIcon />}
                                left={<LinkIcon />} />
                        )}
                        onClick={ sharePageLink } />
                    <ShareButton id="copyimagelink"
                        icon={(
                            <MultiIcon primary={<ShareIcon />}
                                left={<ImageIcon />}
                                right={<LinkIcon />} />
                        )}
                        onClick={copyImageLink} />
                    <ShareButton id="copyimage"
                        icon={(
                            <MultiIcon primary={<ShareIcon />}
                                left={<ImageIcon />} />
                        )}
                        onClick={ copyImage } />
                    <ShareButton id="dlimage"
                        icon={(<FileDownloadOutlinedIcon />)}
                        onClick={ dlImage } />
                </div>
            </div>
        </>
    )
}