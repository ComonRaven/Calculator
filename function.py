import re # 正規表現用ライブラリreをインポート
import math # 数学系ライブラリmathをインポート
import eel # Webアプリを作るためのライブラリeelをインポート

current_mode = "DEG"  # Set default to DEG mode

def simplify_logs(tokens):
  	# 一時スタックで `log` や `ln` を検出して処理
    stack = []  # 一時スタック
    i = 0 # 現在のインデックス(カウント変数)
    while i < len(tokens):
        if tokens[i] in ['log', 'ln'] and i + 2 < len(tokens): # log(a) または ln(a) を検出
            if tokens[i + 1] == '(': # エラーハンドリング logやlnの後に括弧がある場合
                # log(a) を抽出
                end_index_a = find_closing_parenthesis(tokens, i + 1)
                if end_index_a is not None:
                    a_tokens = tokens[i + 2:end_index_a]
                    if end_index_a + 2 < len(tokens) and tokens[end_index_a + 1] in ['+', '-']:
                        # log(a) + log(b) または log(a) - log(b) を検出
                        op = tokens[end_index_a + 1]
                        if tokens[end_index_a + 2] in ['log', 'ln'] and tokens[end_index_a + 3] == '(':
                            end_index_b = find_closing_parenthesis(tokens, end_index_a + 3)
                            if end_index_b is not None:
                                b_tokens = tokens[end_index_a + 4:end_index_b]
                                # log(a*b) または log(a/b) を作成
                                combined_op = '*' if op == '+' else '/'
                                simplified = [tokens[i], '('] + a_tokens + [combined_op] + b_tokens + [')']
                                stack.extend(simplified)
                                i = end_index_b + 1
                                continue
        stack.append(tokens[i])
        i += 1
    return stack

def find_closing_parenthesis(tokens, start_index):
        # 括弧のペアを見つける
        count = 0
        for i in range(start_index, len(tokens)):
            if tokens[i] == '(':
                count += 1
            elif tokens[i] == ')':
                count -= 1
                if count == 0:
                    return i
        return None


# モードに応じて角度をラジアンに変換する関数
def convert_angle(value):
    if current_mode == "DEG":
        return math.radians(value)  # DEGの場合、ラジアンに変換
    return value  # RADの場合はそのまま

# 小数点以下6桁に丸める関数
def round_to_six_decimal_places(value):
    return round(value, 5)

@eel.expose
def calculate_expression(expression):
    # トークン化（数値や演算子を抽出、負の数に対応,sin，cos，tan，asin，acos，atan，log，ln，（，）を抽出）
    # 例）"2 + 3 * sin(45)" -> ["2", "+", "3", "*", "sin", "(", "45", ")"]
    tokens = re.findall(r'(?<!\d)-?\d+\.?\d*|[\+\-\*/\%\^]{1,2}|\(|\)|cosec|sec|cot|sin|cos|tan|arcsin|arccos|arctan|log|ln|e|π|√', expression.lower())

    # 中置記法（通常の数式の書き方）を逆ポーランド記法（RPN）に変換する関数（シャントリングヤードアルゴリズム）
    def infix_to_rpn(tokens):
        output = []	# 数値や関数を格納するリスト（RPN式）
        operators = [] # 演算子や括弧を格納するスタック
        precedence = {'+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '**': 3} # 演算子の優先順位
        right_associative = {'**'}  # 右結合の演算子

        for token in tokens:
            if re.match(r'-?\d+\.?\d*', token):  # 数値
                output.append(token)
            elif token in ['e','π']:  # 定数
                output.append(token)
            elif token in ['sin', 'cos', 'tan', 'arcsin', 'arccos', 'arctan', 'cosec', 'sec', 'cot', 'log', 'ln', '√']:  # 関数
                operators.append(token)
            elif token in precedence:  # 演算子
                while (operators and operators[-1] != '(' and
                       (precedence[operators[-1]] > precedence[token] or
                        (precedence[operators[-1]] == precedence[token] and token not in right_associative))):
                    output.append(operators.pop()) # 優先順位が高い演算子を出力
                operators.append(token)
            elif token == '(':
                operators.append(token) # '('はスタックに追加
            elif token == ')':
                while operators and operators[-1] != '(':
                    output.append(operators.pop()) # 括弧が閉じ丸での演算子を出力
                operators.pop()  # '('をスタックから取り除く
                if operators and operators[-1] in ['sin', 'cos', 'tan', 'arcsin', 'arccos', 'arctan', 'cosec', 'sec', 'cot', 'log', 'ln', '√']:
                    output.append(operators.pop())  # 関数を出力
        while operators:
            output.append(operators.pop()) # 残った演算子を全て出力
        return output

    # RPN式を評価する関数
    def evaluate_rpn(rpn_tokens):
        stack = [] # 結果を格納するスタック
        for token in rpn_tokens:
            if re.match(r'-?\d+\.?\d*', token):  # 数値
                stack.append(float(token))
            elif token == 'sin':
                angle = stack.pop()
                result = math.sin(convert_angle(angle))  # 角度をラジアンに変換してsinを計算
                stack.append(round_to_six_decimal_places(result))  # 小数点以下6桁に丸める
            elif token == 'cos':
                angle = stack.pop()
                result = math.cos(convert_angle(angle))  # 角度をラジアンに変換してcosを計算
                stack.append(round_to_six_decimal_places(result))  # 小数点以下6桁に丸める
            elif token == 'tan':
                angle = stack.pop()
                result = math.tan(convert_angle(angle))  # 角度をラジアンに変換してtanを計算
                stack.append(round_to_six_decimal_places(result))  # 小数点以下6桁に丸める
            elif token == 'arcsin':
                value = stack.pop()
                result = math.asin(value)
                if current_mode == 'DEG':
                    result = math.degrees(result)
                stack.append(round_to_six_decimal_places(result))  # 小数点以下6桁に丸める
            elif token == 'arccos':
                value = stack.pop()
                result = math.acos(value)
                if current_mode == 'DEG':
                    result = math.degrees(result)
                stack.append(round_to_six_decimal_places(result))  # 小数点以下6桁に丸める
            elif token == 'arctan':
                value = stack.pop()
                result = math.atan(value)
                if current_mode == 'DEG':
                    result = math.degrees(result)
                stack.append(round_to_six_decimal_places(result))  # 小数点以下6桁に丸める
            elif token == 'cosec':
                value = stack.pop()
                sin_value = math.sin(convert_angle(value))
                if abs(sin_value) < 1e-10:  # sin(x)が非常に小さい場合
                    raise ValueError("Cosecant is undefined for this value (sin(x) is zero)")
                result = 1 / sin_value
                stack.append(round_to_six_decimal_places(result))  # 小数点以下6桁に丸める
            elif token == 'sec':
                value = stack.pop()
                result = 1 / math.cos(convert_angle(value))
                stack.append(round_to_six_decimal_places(result))  # 小数点以下6桁に丸める
            elif token == 'cot':
                value = stack.pop()
                result = 1 / math.tan(convert_angle(value))
                stack.append(round_to_six_decimal_places(result))  # 小数点以下6桁に丸める
            elif token == 'log':
                value = stack.pop()
                result = math.log10(value)  # 常用対数
                stack.append(round_to_six_decimal_places(result))  # 小数点以下6桁に丸める
            elif token == 'ln':
                value = stack.pop()
                result = math.log(value)  # 自然対数
                stack.append(round_to_six_decimal_places(result))  # 小数点以下6桁に丸める
            elif token == 'e':
                stack.append(round_to_six_decimal_places(math.e))
            elif token == 'π':
                stack.append(round_to_six_decimal_places(math.pi))
            elif token == '√':
                value = stack.pop()
                if value < 0:
                    raise ValueError("Cannot calculate square root of a negative number")
                result = math.sqrt(value)
                stack.append(round_to_six_decimal_places(result))
            else:  # 演算子
                right = stack.pop()
                left = stack.pop()
                if token == '+':
                    stack.append(left + right)
                elif token == '-':
                    stack.append(left - right)
                elif token == '*':
                    stack.append(left * right)
                elif token == '/':
                    if right == 0:
                        raise ValueError("Cannot divide by zero")
                    stack.append(left / right)
                elif token == '%':
                    stack.append(left % right)
                elif token == '**':
                    stack.append(left ** right)
        return stack.pop() # 最後にスタックに残った値が計算結果

    tokens = simplify_logs(tokens) # logやlnの足し算や引き算に対応
    rpn_tokens = infix_to_rpn(tokens) # RPN式に変換
    #print("RPN tokens:", rpn_tokens)  デバッグ用 rpn形式のトークンを出力
    result = evaluate_rpn(rpn_tokens) # 計算する
    return round_to_six_decimal_places(result) # 小数点６文字目を四捨五入して小数点以下５文字で返す

@eel.expose
def toggle_deg_rad():
    # deg rad の切り替えの関数
    global current_mode # グローバル関数のcurrent_modeを取得
    current_mode = "RAD" if current_mode == "DEG" else "DEG"
    '''
    条件演算子を使ったコード省略
    省略しないで書くと下のようになる
    if current_mode == "DEG":
		  current_mode = "RAD"
	  else:
		  current_mode = "DEG"
    '''
    return current_mode