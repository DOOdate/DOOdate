import random

def generate_colour():

    num = random.randint(0, 0xFFFFFF)
    colour = f"#{num:06x}"
    return colour