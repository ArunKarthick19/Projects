import time
import usb_hid

from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keycode import Keycode

keyboard = Keyboard(usb_hid.devices)

# Give yourself 5 seconds to click into Notepad
time.sleep(5)

while True:
    keyboard.send(Keycode.A)
    time.sleep(1)