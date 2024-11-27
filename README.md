[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iK_BQ5En)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=16948459)

# 未実装(諦め)
<15>分数のUI+分数の計算（カーソルも実装） <br>
分数のUI作るの難しい。UIさえ作れれば、計算するだけなのに...

# 実装した機能リスト
<1>カーソルを動かせるようにする <br>
<2>カーソルの位置に文字を入力できるようにする <br>
<3>四則演算 <br>
<4>累乗の計算 <br>
<5>剰余算 <br>
<6>()による計算順序 <br>
<7>sin,cos,tanやlog,ln等の関数を入力した時に()を後ろにつけて表示させる(カーソルも調整) <br>
<8>3sinxなどの時に3×sinxとして処理できるようにする。 <br>
<9>logやlnの足し算、引き算は掛け算、割り算して計算できるようにする <br>
<10>log,lnの計算 <br>
<11>基本的な三角関数計算 <br>
<12>π,eを実装 <br>
<13>√の計算 <br>
<14>DEG,RADの切り替え(UIのみ) <br>
<16>応用的な三角関数の計算 <br>
<17>RADによる三角関数の計算 <br>

# Eelでアプリを作ってみよう！

Lesson3で作ったUIを基に，電卓アプリを作ってみましょう。

まずはこのリポジトリを clone 。<br>
その後，Lesson3で作成したHTML,CSS,JavaScriptなどのコードを
./web などのディレクトリにまとめて置き，commit して push しておく。<br>
*Lesson3とLesson4を同時に開発していくわけではないので， submodule 機能はやめときましょう*<br>
あとは，このリポジトリ内で開発を進めましょう。

指定のディレクトリおよびその中身全部を add したい時は<br>
`% git add ディレクトリ名`<br>
でよい。

アプリ起動をするための呼出Pythonコードは<br>
`main.py`<br>
としてください。

アプリ起動時にウィンドウの大きさを指定したい場合<br>
`eel.start('index.html', size=(640,480))`<br>
などとすると，幅640px，高さ480pxで起動します。<br>
*// Firefoxだとうまく動かない？  chromiumだとリサイズされます*

他のオプションは，EelのREADME.mdにあるApp Option節参照
