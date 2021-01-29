UPDATE
    plate
SET
    name = ${name},
    description = ${description},
    produced_by = ${producer},
    retail_price = ${retailPrice},
    wholesale_price = ${wholesalePrice},
    wholesaler = ${wholesaler}
WHERE
    id = ${id};