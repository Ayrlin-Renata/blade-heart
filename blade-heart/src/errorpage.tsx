import { useRouteError } from "react-router-dom";
import BladeHeartIcon from './components/icons/BladeHeartIcon';

import '@/css/errorpage.scss'

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="errorpage">
      <BladeHeartIcon/>
      <h1>there has been a mistake</h1>
      <p>lol mb... well anyway, it's telling me the problem is </p>
      <h1>
        <i>{error.status + ": " + (error.statusText || error.message)}</i>
      </h1>
      <p>but i won't know about it unless you tell me</p>
    </div>
  );
}