export class PhotoUrlHelper {
  static GetPhotoUrl(photoUrl: string | undefined) {
    if (!photoUrl) return "";
    return `http://localhost:8080/uploads/${photoUrl}`;
  }
}
