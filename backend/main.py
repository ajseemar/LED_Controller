from pyfirmata import Arduino, util
from pyfirmata import INPUT, OUTPUT, PWM

from flask import Flask, jsonify, render_template, request

try:
    board = Arduino('/dev/ttyACM0')
    it = util.Iterator(board)
    it.start()

    redLED = board.get_pin('d:9:o')
    redLED.mode = PWM
    greenLED = board.get_pin('d:10:o')
    greenLED.mode = PWM
    blueLED = board.get_pin('d:11:o')
    blueLED.mode = PWM
except:
    board = None


app = Flask(__name__)


@app.route('/')
def index():
    # return jsonify("hello world from flask")
    return render_template("index.html", token="default+token")


@app.route('/hello')
def hello():
    return jsonify('hello world from flask')


@app.route('/turn_off_led', methods=['GET'])
def turn_off_led():
    if board is None:
        return jsonify("no arduino connected")
    f = open('./mem.txt', 'w')
    print(redLED.read(), greenLED.read(), blueLED.read())
    f.write("%f %f %f" % (redLED.read(), greenLED.read(), blueLED.read()))
    f.close()

    redLED.write(0)
    greenLED.write(0)
    blueLED.write(0)

    # board.exit()
    return jsonify("success")


@app.route('/turn_on_led', methods=['GET'])
def turn_on_led():
    if board is None:
        return jsonify("no arduino connected")
    f = open('./mem.txt')
    color_vals = f.read().split(' ')
    redLED.write(float(color_vals[0]))
    greenLED.write(float(color_vals[1]))
    blueLED.write(float(color_vals[2]))
    f.close()
    return jsonify(r=float(color_vals[0]), g=float(color_vals[1]), b=float(color_vals[2]))


@app.route('/update_led', methods=['POST'])
def update_led():
    if board is None:
        return jsonify("no arduino connected")
    r = float(request.form['r'])
    if (r <= 0.009):
        r = 0
    elif (r >= 0.99):
        r = 1
    g = float(request.form['g'])
    if (g <= 0.009):
        g = 0
    elif (g >= 0.99):
        g = 1
    b = float(request.form['b'])
    if (b <= 0.009):
        b = 0
    elif (b >= 0.99):
        b = 1

    redLED.write(r)
    greenLED.write(g)
    blueLED.write(b)

    return jsonify(r=float(request.form['r']), g=float(
        request.form['g']), b=float(request.form['b']))


if __name__ == "__main__":
    app.run(debug=True)
