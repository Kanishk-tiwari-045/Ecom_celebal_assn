import pymongo
from faker import Faker
import random
import string
from datetime import datetime

# MongoDB connection
MONGO_URI = "mongodb+srv://kanishk-045:RBPesUOL4KSahywH@cluster0.1gv3apv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "test"

client = pymongo.MongoClient(MONGO_URI)
db = client[DB_NAME]
products = db["products"]

fake = Faker()

# Example categories and brands
CATEGORIES = ["Electronics", "Fashion", "Home & Garden", "Sports", "Books"]
BRANDS = ["SoundMagic", "UrbanStyle", "EcoWear", "FitTech", "SmartHome", "RunPro", "BookNest"]

def random_slug(name):
    return (
        name.lower()
        .replace(" ", "-")
        .replace("/", "-")
        .replace("&", "and")
        + "-"
        + "".join(random.choices(string.ascii_lowercase + string.digits, k=4))
    )

def random_images():
    return [
        f"https://picsum.photos/seed/{random.randint(1000,9999)}/400/400"
        for _ in range(random.randint(1, 4))
    ]

def random_product():
    name = fake.sentence(nb_words=3).replace(".", "")
    price = round(random.uniform(10, 1000), 2)
    sale_price = price if random.random() > 0.5 else round(price * random.uniform(0.6, 0.95), 2)
    stock = random.randint(0, 100)
    category = random.choice(CATEGORIES)
    brand = random.choice(BRANDS)
    is_new = random.random() > 0.7
    is_hot = random.random() > 0.8
    rating = round(random.uniform(3.5, 5.0), 1)
    reviews = random.randint(0, 2000)
    now = datetime.utcnow()

    return {
        "name": name,
        "slug": random_slug(name),
        "description": fake.paragraph(nb_sentences=3),
        "price": price,
        "salePrice": sale_price if sale_price < price else None,
        "category": category,
        "brand": brand,
        "image": random_images()[0],
        "images": random_images(),
        "inStock": stock > 0,
        "stockCount": stock,
        "rating": rating,
        "reviews": reviews,
        "isNew": is_new,
        "isHot": is_hot,
        "createdAt": now,
        "updatedAt": now
    }

# Number of products to seed
NUM_PRODUCTS = 100

bulk_products = [random_product() for _ in range(NUM_PRODUCTS)]

result = products.insert_many(bulk_products)
print(f"Inserted {len(result.inserted_ids)} products.")
