import { listenToForm } from "./emailForm.js";
import { prepareTimeline } from "/scripts/formAnims";

listenToForm();
prepareTimeline();
const form = document.querySelector("#mailForm");
form.scrollTo(0, 0);
