import { events } from "./events";
import { init, render } from "./render";
import { Box } from "./utils";


Box(init()).map(render).map(events)