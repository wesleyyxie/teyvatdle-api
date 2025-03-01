import os
from PIL import Image

PATH_TO_SPLASH = "./assets/images/character_splashes/non-pixelated"
PATH_TO_PIXELATED = "./assets/images/character_splashes/pixelated"


def pixelate_images():
    if not os.path.exists(PATH_TO_PIXELATED):
        os.makedirs(PATH_TO_PIXELATED)
    files = files = [
        i
        for i in os.listdir(PATH_TO_SPLASH)
        if not os.path.isdir(os.path.join(PATH_TO_SPLASH, i))
    ]
    for f in files:
        print(f)
        splash = Image.open(PATH_TO_SPLASH + "/" + f)
        for i in range(1, 5):
            splash_small = splash.resize(
                (i * 16, i * 16), resample=Image.Resampling.BILINEAR
            )
            splash_small = splash_small.resize(splash.size, Image.Resampling.NEAREST)
            splash_small.save(
                f'{PATH_TO_PIXELATED}/{f.split(".png")[0]}_pixelated_{i}.png'
            )


if __name__ == "__main__":
    pixelate_images()
