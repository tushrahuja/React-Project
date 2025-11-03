import conf from "../conf/conf.js";
import { Client, ID, TablesDB, Storage, Query, Account } from "appwrite";

export class DatabaseService {
  client = new Client();
  tables;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.tables = new TablesDB(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({title, slug, content, featuredImage, status, userId}) {
    try {
      return await this.tables.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        rowId: ID.unique(),
        data: {
          title,
          content,
          featuredImage,
          status,
          userId
        }

      })
    } catch (error) {
      console.log("Appwrite service :: createPost :: error", error);
    }
  }

  async updatePost(rowId, {title, content, featuredImage, status}) {
    try {
      return await this.tables.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        rowId,
        data: {
          title,
          content,
          featuredImage,
          status
        }
      })
    } catch (error) {
      console.log("Appwrite service :: updatePost :: error", error);
    }
  }

  async deletePost(rowId){
    try {
      await this.tables.deleteRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        rowId
      })
      return true;
    } catch (error) {
      console.log("Appwrite service :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(rowId){
    try {
      return await this.tables.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        rowId
      })
    } catch (error) {
      console.log("Appwrite service :: getPost :: error", error);
      return false;
    }
  }

  async getPosts() {
    try {
      return await this.tables.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        queries: [
          Query.equal('status', 'active')
        ]
      })
    } catch (error) {
      console.log("Appwrite service :: getPosts :: error", error);
      return false;
    }
  }

  //file upload service
  async uploadFile(file){
    try {
      return await this.bucket.createFile({
        bucketId: conf.appwriteBucketId,
        fileId: ID.unique(),
        file
      })
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error", error);
      return false;
    }
  }

  async deleteFile(fileId){
    try {
      await this.bucket.deleteFile({
        bucketId: conf.appwriteBucketId,
        fileId
      })
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId){
    return this.bucket.getFilePreview({
      bucketId: conf.appwriteBucketId,
      fileId
    })
  }
}

const dbService = new DatabaseService();

export default dbService;
