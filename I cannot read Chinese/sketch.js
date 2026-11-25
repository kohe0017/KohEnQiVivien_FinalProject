let img;
let video;
let handPose;
let hands = [];

let pointerX = -100;
let pointerY = -100;

let guqinAudio;
let anythingHovered = false;

//Chinese words/phrases are separated by spaces, English words/phrases that need to be depicted together are connected by underscores. The Chinese and English words correspond directly to one another in this exact arrangement.
let text1 = "我 是个 华人";
let text2 = "I am Chinese";

let text3 = "我 不会 读 华语";
let text4 = "I cannot read Chinese";

let text5 =
  "“讲华语运动” 由 时任总理 李光耀 于1979年 首次发起。 该运动旨在 鼓励 新加坡华人 积极 在日常生活中 使用 华语， 并 培养 对 中华文化 的欣赏 与 热爱。";
let text6 =
  "The_Speak_Mandarin_Activity was Prime_Minister Lee_Kuan_Yew in_1979 started. Something encourage Singaporeans enthusiastic in_daily_life use Chinese, and cultivate towards Chinese_culture appreciaton and love.";

let text7 =
  "“讲华语？我能行！” 这一口号 提醒 我们， 学习和使用 华语 是 一个 持续的 过程， 同时也 鼓励 大家 积极参与其中， 让 这一过程 变得 充满乐趣与享受。";
let text8 =
  "Speak_Chinese? I_can! This_statement reminds us, learning and using Chinese is_a continuous process, concurrently also encourage everyone enthusiastic participation (?), let_this process become ful_of happiness and love(?).";

let text9 = "超过 60%的 新加坡华人 能够 读和写 中文。";
let text10 = "More_than 60%_of Singaporean_Chinese can read_and_write Chinese.";

let text11 =
  "我 觉得 新加坡的 华文 教学 方式 相当 局限。它 并不 侧重于 培养 对 语言 真正 的热爱。我 觉得 它 更 侧重 于不断产出卓越 成果，这倒 也 挺好。但 如果 课 更 看重 分数，而非 学生 对 这门语言 的感受，我 认为 这 便背 离了 语言 学习 的初衷。";
let text12 =
  "I feel_like Singapore's Chinese Education Pedagogies are_quite Something. It doesn't Something cultivate towards language true love. I feel it greater looks_at Somethingsomething results, this also good. But if class more look_at results, rather_than student's towards this_language feelings, I think it Something leave language teaching Something.";

let text13 =
  "我 认为 大多数学生 对 中文 并没有 真正 的热爱 和 激情。对 他们来说，华语 只是 个课程。这相当 令人 失望，因为 作为 华人，以这种 方式 看待 我们的 语言，会 让 我们 自身的中华 文化 及 身份 认同 彻底割裂。";

let text14 =
  "I think most_students towards Chinese don't_have true love and Something. To them, Chinese is_just a_class. This_is_relatively make_people disappointed, because being Chinese, using_this kind_of way look our language, will make us with our(?) Chinese culture and identity Something completely Something. ";

async function setup() {
  createCanvas(841, 595);

  img = await loadImage("bg.png");
  guqinAudio = new Audio("176266__rafaelcaro__guqin-open-strings.wav");
  guqinAudio.loop = true;

  video = createCapture(VIDEO);
  video.size(841, 595);
  video.hide();

  handPose = await ml5.handPose();
  handPose.detectStart(video, gotHands);
}

function gotHands(results) {
  hands = results;
}

function draw() {
  // Draw mirrored webcam feed
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // background image, tint for lowered opacity
  if (img) {
    tint(255, 180);
    image(img, 0, 0, width, height);
    noTint();
  }

  // Track fingertip
  if (hands.length > 0) {
    let indexTip = hands[0].index_finger_tip;
    pointerX = width - indexTip.x;
    pointerY = indexTip.y;
  } else {
    pointerX = -100;
    pointerY = -100;
  }

  // Reset hover state at the start of every frame
  anythingHovered = false;

  // Draw all paragraphs
  drawParagraph(text1, text2, 55, 65, 730, 50, 50);
  drawParagraph(text3, text4, 55, 135, 730, 40, 50);
  drawParagraph(text5, text6, 55, 200, 350, 30, 16);
  drawParagraph(text7, text8, 55, 330, 350, 32, 16);
  drawParagraph(text9, text10, 55, 460, 350, 32, 16);
  drawParagraph(text11, text12, 450, 200, 350, 32, 16);
  drawParagraph(text13, text14, 450, 400, 350, 32, 16);

  if (guqinAudio) {
    if (anythingHovered) {
      if (guqinAudio.paused) {
        guqinAudio.play().catch(() => {});
      }
    } else {
      if (!guqinAudio.paused) {
        guqinAudio.pause();
      }
    }
  }

  if (hands.length > 0) {
    fill(255, 15, 180, 80);
    noStroke();
    circle(pointerX, pointerY, 18);
  }
}

//here, this allows for the paragraph lengths and the gaps between the chinese words and the english words 
function drawParagraph(t1, t2, startX, startY, maxWidth, lineHeight, size) {
  textSize(size);

  let words1 = t1.split(" ");
  let words2 = t2.split(" ");

  let cursorX = startX;
  let cursorY = startY;

  let wordSpacing = size * 0.1;
  let boxH = size * 1.5;

  textAlign(LEFT, CENTER);
  rectMode(CORNER);

  for (let i = 0; i < words1.length; i++) {
    let w1 = words1[i].replaceAll("_", " ");
    let w2 = words2[i] ? words2[i].replaceAll("_", " ") : w1;

    let boxW = textWidth(w1) + size * 0.15;

    if (cursorX + boxW > startX + maxWidth) {
      cursorX = startX;
      cursorY += lineHeight;
    }

    let isHovered =
      pointerX > cursorX &&
      pointerX < cursorX + boxW &&
      pointerY > cursorY - boxH / 2 &&
      pointerY < cursorY + boxH / 2;

    if (isHovered) {
      anythingHovered = true;
    }

    let displayWord = isHovered ? w2 : w1;
    let activeBoxW = textWidth(displayWord) + size * 0.15;

    if (cursorX + activeBoxW > startX + maxWidth) {
      cursorX = startX;
      cursorY += lineHeight;
    }

    fill(isHovered ? color(200, 0, 0) : color(0));
    text(displayWord, cursorX, cursorY);

    cursorX += activeBoxW + wordSpacing;
  }
}

function mousePressed() {
  if (guqinAudio && guqinAudio.paused) {
    guqinAudio
      .play()
      .then(() => {
        if (!anythingHovered) guqinAudio.pause();
      })
      .catch(() => {});
  }
}
