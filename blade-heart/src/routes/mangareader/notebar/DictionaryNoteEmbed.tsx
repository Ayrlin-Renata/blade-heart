import { useEffect, useState } from "preact/hooks";

import AudioPlayer from '../../../components/AudioPlayer.tsx';

import '@/css/mangareader/notebar/notedefinition.scss';


interface DictionaryNoteEmbed {
    term: string;
}

export default function ({ term }: DictionaryNoteEmbed) {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + term);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setData(null);
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.warn("Error while fetching dictionary result for: " + term)
                console.warn(error)
            }
        };
        fetchData();
    }, [term]);

    var defDisplay;
    if (data) {
        const result = data[0];

        defDisplay = (
            <>
                <div class="emcard phonetics">
                    {(result.phonetics && result.phonetics[0] && result.phonetics[0].audio) ?
                        <>
                            <AudioPlayer src={result.phonetics[0].audio} icon />
                            <div>
                                <a
                                    href={result.phonetics[0].sourceUrl}
                                    class="source"
                                    target="_blank">Source</a>
                                {result.phonetics[0].license ? (
                                    <a
                                        href={result.phonetics[0].license.url ?
                                            result.phonetics[0].license.url
                                            : ""}
                                        class="license"
                                        target="_blank">
                                        {result.phonetics[0].license.name ?
                                            result.phonetics[0].license.name
                                            : ""}
                                    </a>
                                ) : ""}
                            </div>
                        </> : ""
                    }
                </div>
                <div class="emcard term">
                    <div class="word">{result.word}</div>
                    <div class="phonetic">{result.phonetic}</div>
                </div>
                {result.meanings.map((mean: any) => (
                    <div class="emcard meaning">
                        <div class="partofspeech">{mean.partOfSpeech}</div>
                        <div class="definitions">{
                            mean.definitions.map((def: any) => (
                                <div>
                                    <div class="text">
                                        <div class="label">definition</div>
                                        <div class="value">{def.definition}</div>
                                    </div>
                                    {def.synonyms.length > 0 ?
                                        <div class="synonyms">
                                            <div class="label">synonyms</div>
                                            <div class="value">{def.synonyms.join(", ")}</div>
                                        </div> : <></>}
                                    {def.antonyms.length > 0 ?
                                        <div class="antonyms">
                                            <div class="label">antonyms</div>
                                            <div class="value">{def.antonyms.join(", ")}</div>
                                        </div> : <></>}
                                </div>
                            ))}
                        </div>
                    </div>
                )
                )}
                <div class="emcard licensecard">
                    <a href={result.license.url} class="license" target="_blank">{result.license.name}</a>
                </div>
                <div class="emcard sources">
                    {
                        result.sourceUrls.map((url: any) => (<a href={url} class="sourceUrl" target="_blank">{url}</a>))
                    }
                </div>
            </>
        );
    }

    return (
        <>
            <div class="dictionaryembed">
                {
                    !data ? (<div class="error">
                        {term? "Error looking up '" + term + "', google it ok? :3" : ""}
                    </div>)
                        : (<div>{defDisplay}</div>)
                }
            </div>
        </>
    )
}