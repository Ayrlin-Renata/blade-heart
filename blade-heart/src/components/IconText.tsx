import "@/css/components/icontext.scss"

interface IconText {
    icon: any,
    children: any,
}

export default function ({ icon, children }: IconText) {


    return (
        <>
            <div class="icontext">
                {icon}
                <div class="text">{children}</div>
            </div>
        </>
    ) 
}