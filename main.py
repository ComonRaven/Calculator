import eel  # Webアプリを作るためのライブラリeelをインポート
import function # function.pyをインポート

eel.init("web")   # webフォルダを起動
eel.start("index.html", mode="default")  # index.htmlを起動