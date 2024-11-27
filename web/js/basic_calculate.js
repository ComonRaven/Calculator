function calculateExpression() {
  let expression = document.querySelector('.screen1').value;

  // 演算子の変換（× → *、÷ → /、^→**）
  expression = expression.replaceAll('×', '*').replaceAll('÷', '/').replaceAll('^', '**');

  // 必要な乗算を補完
  expression = expression.replace(/(\d)(sin|cos|tan|arcsin|arccos|arctan|log|ln|cosec|sec|cot|√|\()/g, '$1*$2'); // 数値の後に関数または括弧
  expression = expression.replace(/(π|e)(\d|\()/g, '$1*$2'); // π または e の後に数値や括弧
  expression = expression.replace(/(\d|\))\(/g, '$1*('); // (1+1)(1+1) を (1+1)*(1+1) に変換

  // eel.calculate_expression を呼び出す
  eel.calculate_expression(expression)(function(result) { // 引数としてexpressionを渡す 戻り値をresultに格納
      document.querySelector('.screen1').value = result; // 計算結果を画面に表示
      inputList = []; // 入力リストをクリア
      inputList = result.toString().split(''); // 入力リストに計算結果''で分割して格納
      const screen = document.querySelector('.screen1');
      cursorPosition = screen.value.length; // カーソルの位置を計算
      updateCursorPosition(screen.value || ''); // カーソルの位置を更新
  });
}

// イベントリスナーを設定して "=" ボタンで計算を実行
document.querySelector('.equal').addEventListener('click', () => {
    calculateExpression(); // calculateExpression 関数を呼び出す
});