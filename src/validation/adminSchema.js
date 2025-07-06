import * as Yup from "yup";

export const adminSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, "Ism kamida 3 ta belgidan iborat bo‘lishi kerak")
        .max(15, "Ism 15 tadan ko‘p bo‘lmasligi lozim")
        .required("Ism bo‘sh bo‘lishi mumkin emas"),
    adminUsername: Yup.string()
        .min(4, "Username kamida 4 ta belgidan iborat bo‘lishi kerak")
        .max(15, "Username 15 tadan ko‘p bo‘lmasligi lozim")
        .required("Username bo‘sh bo‘lishi mumkin emas"),
    adminPassword: Yup.string()
        .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak")
        .required("Parol bo‘sh bo‘lishi mumkin emas"),
    adminRole: Yup.string()
        .oneOf(["ADMIN", "SUPERADMIN"], "Noto‘g‘ri rol tanlandi")
        .required("Rol tanlash majburiy"),
    adminImage: Yup.mixed()
        .required("Rasm yuklash majburiy")
        .test(
            "fileSize",
            "Rasm hajmi 2MB dan katta bo‘lmasligi kerak",
            (file) => file && file.size <= 2 * 1024 * 1024
        )
        .test(
            "fileType",
            "Faqat JPG/PNG formatdagi rasm qabul qilinadi",
            (file) => file && ["image/jpeg", "image/png"].includes(file.type)
        ),
});
