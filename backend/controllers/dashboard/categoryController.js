const categoryModel = require("../../models/categoryModel");
const { responseReturn } = require("../../utiles/response");
const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");

class categoryController {
  delete_category = async (req, res) => {
    try {
      const id_category = req.params.id_category;
      const category = await categoryModel.findById(id_category);

      if (!category) {
        return responseReturn(res, 404, { error: "Category not found" });
      }

      await categoryModel.findByIdAndDelete(id_category);
      return responseReturn(res, 200, {
        message: "Category successfully deleted",
      });
    } catch (error) {
      console.error(error);
      return responseReturn(res, 500, {
        error: "An error occurred while deleting the category",
      });
    }
  };

  add_category = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 404, { error: "something error" });
      } else {
        let { name } = fields;
        let { image } = files;
        name = name.trim();
        const slug = name.split(" ").join("-");

        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.api_secret,
          secure: true,
        });

        try {
          const result = await cloudinary.uploader.upload(image.filepath, {
            folder: "categorys",
          });

          if (result) {
            const category = await categoryModel.create({
              name,
              slug,
              image: result.url,
            });
            responseReturn(res, 201, {
              category,
              message: "category add success",
            });
          } else {
            responseReturn(res, 404, { error: "Image upload failed" });
          }
        } catch (error) {
          responseReturn(res, 500, { error: "Internal server error" });
        }
      }
    });
  };

  update_category = async (req, res) => {
    const { id_category } = req.params;
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 400, { error: "Bad request" });
      } else {
        let { name } = fields;
        let { image } = files;
        let { status } = fields;

        name = name.trim();
        const slug = name.split(" ").join("-");

        // Initialize cloudinary
        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.api_secret,
          secure: true,
        });

        try {
          const oldCategory = await categoryModel.findById(id_category);

          if (!oldCategory) {
            return responseReturn(res, 404, { error: "Category not found" });
          }

          let imageUrl = oldCategory.image;
          if (image) {
            // Deleting old image
            const publicId = imageUrl.split("/").pop().split(".").shift(); // extracting public ID from URL
            await cloudinary.uploader.destroy(publicId);
            // Uploading new image
            const uploadResult = await cloudinary.uploader.upload(
              image.filepath,
              {
                folder: "categorys",
              }
            );
            imageUrl = uploadResult.url;
          }

          const updateData = { name, slug, image: imageUrl, status };

          const updatedCategory = await categoryModel.findByIdAndUpdate(
            id_category,
            updateData,
            {
              new: true, // Return the updated document
            }
          );

          if (updatedCategory) {
            responseReturn(res, 200, {
              category: updatedCategory,
              message: "Cập nhật danh mục thành công",
            });
          } else {
            responseReturn(res, 404, { error: "Danh mục không tồn tạise" });
          }
        } catch (error) {
          console.error(error);
          responseReturn(res, 500, { error: "Internal server error" });
        }
      }
    });
  };

  edit_category = async (req, res) => {
    const id_category = req.params;
    try {
      const category = await categoryModel.findById(id_category);
      console.log(category);
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  get_category = async (req, res) => {
    const { page, searchValue, parPage } = req.query;
    try {
      let skipPage = "";
      if (parPage && page) {
        skipPage = parseInt(parPage) * (parseInt(page) - 1);
      }
      if (searchValue && page && parPage) {
        const categorys = await categoryModel
          .find({
            $text: { $search: searchValue },
          })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel
          .find({
            $text: { $search: searchValue },
          })
          .countDocuments();
        responseReturn(res, 200, { totalCategory, categorys });
      } else if (searchValue === "" && page && parPage) {
        const categorys = await categoryModel
          .find({})
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();
        responseReturn(res, 200, { totalCategory, categorys });
      } else {
        const categorys = await categoryModel.find({}).sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();
        responseReturn(res, 200, { totalCategory, categorys });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
}

module.exports = new categoryController();
