

export default function ({ children, type, title, desc } : { children: any, type: string, title: string, desc: string }) {
    return (
        <>
        <div class="bh-mediacard" onClick={ () => alert(title) }>
            { children }
            <div class="details">
                <p class="title">{ title }</p>
                <p class="type">{ type }</p>
                <p class="desc">{ desc }</p>
            </div>
        </div>
        </>
    )
}