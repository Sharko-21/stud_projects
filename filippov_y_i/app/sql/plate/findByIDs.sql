SELECT
   *
FROM
    plate
WHERE
    plate.id IN (${ids});
