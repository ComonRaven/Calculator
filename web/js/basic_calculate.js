function calculateExpression() {
  let expression = document.querySelector('.screen1').value;

  // 演算子の変換（× → *、÷ → /、^→**）
  expression = expression.replaceAll('×', '*').replaceAll('÷', '/').replaceAll('^', '**');

  // 必要な乗算を補完
  expression = expression.replace(/(\d)(sin|cos|tan|arcsin|arccos|arctan|log|ln|cosec|sec|cot|√|\()/g, '$1*$2'); // 数値の後に関数または括弧
  expression = expression.replace(/(π|e)(\d|\()/g, '$1*$2'); // π または e の後に数値や括弧
  expression = expression.replace(/(\d|\))\(/g, '$1*('); // (1+1)(1+1) を (1+1)*(1+1) に変換

  // eel.calculate_expression を呼び出す
  eel.calculate_expression(expression)(function(result) {
      document.querySelector('.screen1').value = result;
      inputList = [];
      inputList = result.toString().split('');
      const screen = document.querySelector('.screen1');
      cursorPosition = screen.value.length;
      updateCursorPosition(screen.value || '');
      console.log("inputList:", inputList);
  });
}

// イベントリスナーを設定して "=" ボタンで計算を実行
document.querySelector('.equal').addEventListener('click', () => {
    calculateExpression();
});