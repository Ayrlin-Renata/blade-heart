import { VNode } from "preact";
import '../css/multiicon.scss';

interface MultiIcon {
    primary: VNode<any>,
    left: VNode<any>,
    right?: VNode<any>
}

export default function ({ primary, left, right }: MultiIcon) {


    return (
        <>
            <div class="multiicon">
                <div class="bg primary">{primary}</div>
                <div class="fg primary">{primary}</div>
                <div class="bg left">{left}</div>
                <div class="fg left">{left}</div>
                {right ? (
                    <>
                        <div class="bg right">{right}</div>
                        <div class="fg right">{right}</div>
                    </>
                ) : (<></>)}
            </div>
        </>
    )
}